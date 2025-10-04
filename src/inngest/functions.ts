import { createAgent, openai, type TextMessage } from '@inngest/agent-kit';
import { eq, inArray } from 'drizzle-orm';
import JSONL from 'jsonl-parse-stringify';

import type { StreamTranscriptItem } from '@/modules/meetings/types';

import { SUMMARIZER_AGENT_PROMPT } from '@/config';
import { db } from '@/db';
import { MeetingStatus, agents, meetings, users } from '@/db/schema';
import { env } from '@/env/server';

import { inngest } from './client';

const summarizer = createAgent({
	model: openai({ apiKey: env.OPENAI_API_KEY, model: 'gpt-5-nano' }),
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

		const { output } = await summarizer.run(
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
