import { TRPCError } from '@trpc/server';
import { and, desc, eq, getTableColumns, ilike, type SQLWrapper } from 'drizzle-orm';
import z from 'zod';

import { MeetingSchema, MeetingUpdateSchema } from '@/modules/meetings/schema';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '@/config';
import { db } from '@/db';
import { meetings } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const meetingsRouter = createTRPCRouter({
	create: protectedProcedure.input(MeetingSchema).mutation(async ({ ctx, input }) => {
		const { agentId, name } = input;
		const {
			auth: { user },
		} = ctx;

		const [meeting] = await db.insert(meetings).values({ agentId, name, userId: user.id }).returning();

		// TODO: Create Stream Call, Upsert Stream Users

		return meeting;
	}),
	getMany: protectedProcedure
		.input(
			z
				.object({
					page: z.number().default(DEFAULT_PAGE),
					pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
					search: z.string().trim().nullish(),
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
			const { page, pageSize, search } = input;

			const where: (SQLWrapper | undefined)[] = [eq(meetings.userId, user.id)];

			if (!!search) where.push(ilike(meetings.name, `%${search}%`));

			const data = await db
				.select({
					...getTableColumns(meetings),
				})
				.from(meetings)
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
			})
			.from(meetings)
			.where(and(eq(meetings.id, meetingId), eq(meetings.userId, user.id)));

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
