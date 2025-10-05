/* eslint-disable camelcase */

import { TRPCError } from '@trpc/server';
import { and, desc, eq, getTableColumns, ilike, inArray, sql, type SQLWrapper } from 'drizzle-orm';
import JSONL from 'jsonl-parse-stringify';
import z from 'zod';

import { MeetingSchema, MeetingUpdateSchema } from '@/modules/meetings/schema';
import type { StreamTranscriptItem } from '@/modules/meetings/types';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '@/config';
import { db } from '@/db';
import { MeetingStatus, agents, meetings, users } from '@/db/schema';
import { generateAvatarUri } from '@/lib/avatar';
import { streamVideo } from '@/lib/stream-video';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const meetingsRouter = createTRPCRouter({
	create: protectedProcedure.input(MeetingSchema).mutation(async ({ ctx, input }) => {
		const { agentId, name } = input;
		const {
			auth: { user },
		} = ctx;

		const [meeting] = await db.insert(meetings).values({ agentId, name, userId: user.id }).returning();

		const call = streamVideo.video.call('default', meeting.id);

		await call.create({
			data: {
				created_by_id: user.id,
				custom: {
					meetingId: meeting.id,
					meetingName: meeting.name,
				},
				settings_override: {
					recording: {
						mode: 'auto-on',
						quality: '1080p',
					},
					transcription: {
						closed_caption_mode: 'auto-on',
						language: 'en',
						mode: 'auto-on',
					},
				},
			},
		});

		const [agent] = await db
			.select()
			.from(agents)
			.where(and(eq(agents.id, meeting.agentId), eq(agents.userId, user.id)));

		if (!agent) throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found!' });

		await streamVideo.upsertUsers([
			{
				id: agent.id,
				image: generateAvatarUri({
					seed: agent.name,
					variant: 'botttsNeutral',
				}),
				name: agent.name,
				role: 'user',
			},
		]);

		return meeting;
	}),
	generateToken: protectedProcedure.mutation(async ({ ctx }) => {
		const {
			auth: { user },
		} = ctx;

		await streamVideo.upsertUsers([
			{
				id: user.id,
				image: user.image || generateAvatarUri({ seed: user.name, variant: 'initials' }),
				name: user.name,
				role: 'admin',
			},
		]);

		const expirationTime = Math.floor(Date.now() / 1000) + 3600; /// 1 hour
		const issuedAt = Math.floor(Date.now() / 1000) - 60;

		const token = streamVideo.generateUserToken({
			exp: expirationTime,
			user_id: user.id,
			validity_in_seconds: issuedAt,
		});

		return token;
	}),
	getMany: protectedProcedure
		.input(
			z
				.object({
					agentId: z.string().trim().nullish(),
					page: z.number().default(DEFAULT_PAGE),
					pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
					search: z.string().trim().nullish(),
					status: z.enum(MeetingStatus).nullish(),
				})
				.optional()
				.default({
					page: DEFAULT_PAGE,
					pageSize: DEFAULT_PAGE_SIZE,
					search: null,
				})
		)
		.query(async ({ ctx, input }) => {
			const {
				auth: { user },
			} = ctx;
			const { agentId, page, pageSize, search, status } = input;

			const where: (SQLWrapper | undefined)[] = [eq(meetings.userId, user.id)];

			if (!!search) where.push(ilike(meetings.name, `%${search}%`));
			if (!!status) where.push(eq(meetings.status, status));
			if (!!agentId) where.push(eq(meetings.agentId, agentId));

			const data = await db
				.select({
					...getTableColumns(meetings),
					agent: agents,
					duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as('duration'),
				})
				.from(meetings)
				.innerJoin(agents, eq(meetings.agentId, agents.id))
				.where(and(...where))
				.orderBy(desc(meetings.createdAt), desc(meetings.id))
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			const totalMeetings = await db.$count(meetings, and(...where));

			const totalPages = Math.ceil(totalMeetings / pageSize);

			return {
				items: data,
				total: totalMeetings,
				totalPages,
			};
		}),
	getOne: protectedProcedure.input(z.object({ id: z.string().trim().min(1) })).query(async ({ ctx, input }) => {
		const {
			auth: { user },
		} = ctx;
		const { id: meetingId } = input;

		const [meeting] = await db
			.select({
				...getTableColumns(meetings),
				agent: agents,
				duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as('duration'),
			})
			.from(meetings)
			.innerJoin(agents, eq(meetings.agentId, agents.id))
			.where(and(eq(meetings.id, meetingId), eq(meetings.userId, user.id)));

		if (!meeting) throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found!' });

		return meeting;
	}),
	getTranscript: protectedProcedure.input(z.object({ id: z.string().trim().min(1) })).query(async ({ ctx, input }) => {
		const {
			auth: { user },
		} = ctx;
		const { id: meetingId } = input;

		const [meeting] = await db
			.select()
			.from(meetings)
			.where(and(eq(meetings.id, meetingId), eq(meetings.userId, user.id)));

		if (!meeting) throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found!' });

		if (!meeting.transcriptUrl) return [];

		const transcript = await fetch(meeting.transcriptUrl)
			.then((res) => res.text())
			.then((text) => JSONL.parse<StreamTranscriptItem>(text))
			.catch(() => []);

		const speakerIds = [...new Set(transcript.map((item) => item.speaker_id))];

		const userSpeakers = await db.select().from(users).where(inArray(users.id, speakerIds));

		const normalizedUserSpeakers = userSpeakers.map((user) => ({
			...user,
			image: user.image ?? generateAvatarUri({ seed: user.name, variant: 'initials' }),
		}));

		const agentSpeakers = await db.select().from(agents).where(inArray(agents.id, speakerIds));

		const normalizedAgentSpeakers = agentSpeakers.map((agent) => ({
			...agent,
			image: generateAvatarUri({ seed: agent.name, variant: 'botttsNeutral' }),
		}));

		const speakers = [...normalizedUserSpeakers, ...normalizedAgentSpeakers];

		const transcriptWithSpeakers = transcript.map((item) => {
			const speaker = speakers.find((speaker) => speaker.id === item.speaker_id);

			if (!speaker) {
				return {
					...item,
					user: {
						image: generateAvatarUri({
							seed: 'Unknown',
							variant: 'initials',
						}),
						name: 'Unknown',
					},
				};
			}

			return {
				...item,
				user: {
					image: speaker.image,
					name: speaker.name,
				},
			};
		});

		return transcriptWithSpeakers;
	}),
	remove: protectedProcedure.input(z.object({ id: z.string().trim().min(1) })).mutation(async ({ ctx, input }) => {
		const {
			auth: { user },
		} = ctx;
		const { id: meetingId } = input;

		const [meeting] = await db
			.delete(meetings)
			.where(and(eq(meetings.id, meetingId), eq(meetings.userId, user.id)))
			.returning();

		if (!meeting) throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found!' });

		return meeting;
	}),
	update: protectedProcedure.input(MeetingUpdateSchema).mutation(async ({ ctx, input }) => {
		const {
			auth: { user },
		} = ctx;
		const { agentId, id: meetingId, name } = input;

		const [meeting] = await db
			.update(meetings)
			.set({
				agentId,
				name,
			})
			.where(and(eq(meetings.id, meetingId), eq(meetings.userId, user.id)))
			.returning();

		if (!meeting) throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found!' });

		return meeting;
	}),
});
