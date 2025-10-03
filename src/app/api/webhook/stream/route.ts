import { NextRequest, NextResponse } from 'next/server';

import type {
	CallEndedEvent,
	CallRecordingReadyEvent,
	CallSessionParticipantLeftEvent,
	CallSessionStartedEvent,
	CallTranscriptionReadyEvent,
	WebhookEvent,
} from '@stream-io/node-sdk';
import { and, eq } from 'drizzle-orm';

import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from '@/config/http-status-codes';
import { db } from '@/db';
import { MeetingStatus, agents, meetings } from '@/db/schema';
import { env } from '@/env/server';
import { streamVideo } from '@/lib/stream-video';

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

			// TODO: Call Inngest background job to summarize the transcript

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
		default:
			console.warn(`Unhandled event: ${eventType}, payload: ${payload}`);
	}

	return NextResponse.json({ status: OK });
}
