import { NextRequest, NextResponse } from 'next/server';

import type {
	CallEndedEvent,
	CallRecordingReadyEvent,
	CallSessionParticipantLeftEvent,
	CallSessionStartedEvent,
	CallTranscriptionReadyEvent,
	MessageNewEvent,
	WebhookEvent,
} from '@stream-io/node-sdk';
import { and, eq } from 'drizzle-orm';
import { OpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';

import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNAUTHORIZED } from '@/config/http-status-codes';
import { db } from '@/db';
import { MeetingStatus, agents, meetings } from '@/db/schema';
import { env } from '@/env/server';
import { inngest } from '@/inngest/client';
import { generateAvatarUri } from '@/lib/avatar';
import { streamChat } from '@/lib/stream-chat';
import { streamVideo } from '@/lib/stream-video';
import { createChatInstructions } from '@/lib/utils';

const openAIClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const verifySignatureWithSDK = (body: string, signature: string): boolean => {
	return streamVideo.verifyWebhook(body, signature);
};

export async function POST(req: NextRequest) {
	const signature = req.headers.get('x-signature');
	const apiKey = req.headers.get('x-api-key');

	if (!signature || !apiKey)
		return NextResponse.json({ error: 'Missing signature or API Key!' }, { status: BAD_REQUEST });

	const body = await req.text();

	if (!verifySignatureWithSDK(body, signature))
		return NextResponse.json({ error: 'Invalid signature!' }, { status: UNAUTHORIZED });

	let payload: unknown;

	try {
		payload = JSON.parse(body) as Record<string, unknown>;
	} catch {
		return NextResponse.json({ error: 'Invalid JSON!' }, { status: BAD_REQUEST });
	}

	const eventType = (payload as Record<string, unknown>)?.type as WebhookEvent['type'];

	switch (eventType) {
		case 'call.session_started': {
			const event = payload as CallSessionStartedEvent;
			const meetingId = event.call.custom?.meetingId as string | undefined;

			if (!meetingId) return NextResponse.json({ error: 'Missing meeting id!' }, { status: BAD_REQUEST });

			const [existingMeeting] = await db
				.select({
					agent: agents,
					id: meetings.id,
				})
				.from(meetings)
				.innerJoin(agents, eq(agents.id, meetings.agentId))
				.where(and(eq(meetings.id, meetingId), eq(meetings.status, MeetingStatus.UPCOMING)));

			if (!existingMeeting) return NextResponse.json({ error: 'Meeting not found!' }, { status: NOT_FOUND });

			await db
				.update(meetings)
				.set({ startedAt: new Date(), status: MeetingStatus.ACTIVE })
				.where(eq(meetings.id, existingMeeting.id));

			const call = streamVideo.video.call('default', meetingId);

			const realtimeClient = await streamVideo.video.connectOpenAi({
				agentUserId: existingMeeting.agent.id,
				call,
				openAiApiKey: env.OPENAI_API_KEY,
			});

			realtimeClient.updateSession({
				instructions: existingMeeting.agent.instructions,
			});

			break;
		}
		case 'call.session_participant_left': {
			const event = payload as CallSessionParticipantLeftEvent;
			const meetingId = event.call_cid.split(':')?.[1] as string | undefined; // call_cid is formatted as "type:id"

			if (!meetingId) return NextResponse.json({ error: 'Missing meeting id!' }, { status: BAD_REQUEST });

			const call = streamVideo.video.call('default', meetingId);
			await call.end();

			break;
		}
		case 'call.session_ended': {
			const event = payload as CallEndedEvent;
			const meetingId = event.call.custom?.meetingId as string | undefined;

			if (!meetingId) return NextResponse.json({ error: 'Missing meeting id!' }, { status: BAD_REQUEST });

			await db
				.update(meetings)
				.set({ endedAt: new Date(), status: MeetingStatus.PROCESSING })
				.where(and(eq(meetings.id, meetingId), eq(meetings.status, MeetingStatus.ACTIVE)));

			break;
		}
		case 'call.transcription_ready': {
			const event = payload as CallTranscriptionReadyEvent;
			const meetingId = event.call_cid.split(':')?.[1] as string | undefined; // call_cid is formatted as "type:id"

			if (!meetingId) return NextResponse.json({ error: 'Missing meeting id!' }, { status: BAD_REQUEST });

			const [updatedMeeting] = await db
				.update(meetings)
				.set({ transcriptUrl: event.call_transcription.url })
				.where(eq(meetings.id, meetingId))
				.returning();

			if (!updatedMeeting) return NextResponse.json({ error: 'Meeting not found!' }, { status: NOT_FOUND });

			await inngest.send({
				data: {
					meetingId: updatedMeeting.id,
					transcriptUrl: updatedMeeting.transcriptUrl,
				},
				name: 'meetings/processing',
			});

			break;
		}
		case 'call.recording_ready': {
			const event = payload as CallRecordingReadyEvent;
			const meetingId = event.call_cid.split(':')?.[1] as string | undefined; // call_cid is formatted as "type:id"

			if (!meetingId) return NextResponse.json({ error: 'Missing meeting id!' }, { status: BAD_REQUEST });

			await db
				.update(meetings)
				.set({ recordingUrl: event.call_recording.url })
				.where(eq(meetings.id, meetingId))
				.returning();

			break;
		}
		case 'message.new': {
			const event = payload as MessageNewEvent;

			const userId = event.user?.id;
			const channelId = event.channel_id;
			const text = event.message?.text;

			if (!userId || !channelId || !text) {
				return NextResponse.json(
					{
						error: 'Missing required fields.',
					},
					{ status: BAD_REQUEST }
				);
			}

			const [meeting] = await db
				.select()
				.from(meetings)
				.where(and(eq(meetings.id, channelId), eq(meetings.status, MeetingStatus.COMPLETED)));

			if (!meeting) return NextResponse.json({ error: 'Meeting not found!' }, { status: NOT_FOUND });

			const [agent] = await db.select().from(agents).where(eq(agents.id, meeting.agentId));

			if (!agent) return NextResponse.json({ error: 'Agent not found!' }, { status: NOT_FOUND });

			if (userId !== agent.id) {
				const instructions = createChatInstructions(meeting.summary || '', agent.instructions);

				const channel = streamChat.channel('messaging', channelId);
				await channel.watch();

				const previousMessages = channel.state.messages
					.slice(-5)
					.filter((msg) => msg.text && msg.text.trim() !== '')
					.map<ChatCompletionMessageParam>((message) => ({
						content: message.text || '',
						role: message.user?.id === agent.id ? 'assistant' : 'user',
					}));

				const gptResponse = await openAIClient.chat.completions.create({
					messages: [{ content: instructions, role: 'system' }, ...previousMessages, { content: text, role: 'user' }],
					model: 'gpt-4.1-nano',
				});

				const gptTextResponse = gptResponse.choices?.[0]?.message?.content;

				if (!gptTextResponse) {
					return NextResponse.json(
						{
							error: 'No response from GPT!',
						},
						{ status: INTERNAL_SERVER_ERROR }
					);
				}

				const avatarUrl = generateAvatarUri({
					seed: agent.name,
					variant: 'botttsNeutral',
				});

				streamChat.upsertUser({
					id: agent.id,
					image: avatarUrl,
					name: agent.name,
				});

				channel.sendMessage({
					text: gptTextResponse,
					user: {
						id: agent.id,
						image: avatarUrl,
						name: agent.name,
					},
				});
			}

			break;
		}
		default:
			console.warn(`Unhandled event: ${eventType}, payload: ${payload}`);
	}

	return NextResponse.json({ status: OK });
}
