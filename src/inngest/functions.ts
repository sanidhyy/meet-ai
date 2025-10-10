import { createAgent, openai, type TextMessage } from '@inngest/agent-kit';
import { eq, inArray } from 'drizzle-orm';
import { NonRetriableError } from 'inngest';
import JSONL from 'jsonl-parse-stringify';
import { UTApi } from 'uploadthing/server';

import type { StreamTranscriptItem } from '@/modules/meetings/types';

import { SUMMARIZER_AGENT_PROMPT } from '@/config';
import { db } from '@/db';
import { MeetingStatus, agents, meetings, userSettings, users } from '@/db/schema';
import { decrypt } from '@/lib/encryption';

import { inngest } from './client';

const summarizer = (apiKey: string) =>
	createAgent({
		model: openai({ apiKey, model: 'gpt-5-nano' }),
		name: 'summarizer',
		system: SUMMARIZER_AGENT_PROMPT.trim(),
	});

export const meetingsProcessing = inngest.createFunction(
	{
		id: 'meetings/processing',
	},
	{
		event: 'meetings/processing',
	},
	async ({ event, step }) => {
		const response = await step.run('fetch-transcript', async () => {
			return fetch(event.data.transcriptUrl).then((res) => res.text());
		});

		const transcript = await step.run('parse-transcript', async () => {
			return JSONL.parse<StreamTranscriptItem>(response);
		});

		const transcriptWithSpeakers = await step.run('add-speakers', async () => {
			const speakerIds = [...new Set(transcript.map((item) => item.speaker_id))];

			const userSpeakers = await db
				.select({ id: users.id, name: users.name })
				.from(users)
				.where(inArray(users.id, speakerIds));
			const agentSpeakers = await db
				.select({ id: agents.id, name: agents.name })
				.from(agents)
				.where(inArray(agents.id, speakerIds));

			const speakers = [...userSpeakers, ...agentSpeakers];

			return transcript.map((item) => {
				const speaker = speakers.find((speaker) => speaker.id === item.speaker_id);

				if (!speaker) {
					return {
						...item,
						user: {
							name: 'Unknown',
						},
					};
				}

				return {
					...item,
					user: {
						name: speaker.name,
					},
				};
			});
		});

		const apiKey = await step.run('get-api-key', async () => {
			const [meeting] = await db
				.select({ userId: meetings.userId })
				.from(meetings)
				.where(eq(meetings.id, event.data.meetingId));

			const [aiSettings] = await db.select().from(userSettings).where(eq(userSettings.userId, meeting.userId));

			if (!aiSettings) throw new NonRetriableError('API Key not set!');

			return decrypt(aiSettings.apiKey);
		});

		const { output } = await summarizer(apiKey).run(
			`Summarize the following transcript: ${JSON.stringify(transcriptWithSpeakers)}`
		);

		await step.run('save-summary', async () => {
			await db
				.update(meetings)
				.set({ status: MeetingStatus.COMPLETED, summary: (output[0] as TextMessage).content as string })
				.where(eq(meetings.id, event.data.meetingId));
		});
	}
);

export const meetingsRecordingReady = inngest.createFunction(
	{
		id: 'meetings/recording-ready',
	},
	{
		event: 'meetings/recording-ready',
	},
	async ({ event, step }) => {
		const uploadedRecordingUrl = await step.run('upload-recording', async () => {
			const utapi = new UTApi();

			const [uploadedRecording] = await utapi.uploadFilesFromUrl([event.data.recordingUrl]);

			if (uploadedRecording.error || !uploadedRecording.data?.ufsUrl)
				throw new Error(uploadedRecording.error?.message || 'Failed to upload meeting recording!');

			return uploadedRecording.data.ufsUrl;
		});

		await step.run('save-recording', async () => {
			await db
				.update(meetings)
				.set({ recordingUrl: uploadedRecordingUrl })
				.where(eq(meetings.id, event.data.meetingId));
		});
	}
);
