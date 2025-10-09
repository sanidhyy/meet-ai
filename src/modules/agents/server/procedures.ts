import { TRPCError } from '@trpc/server';
import { and, desc, eq, getTableColumns, ilike, type SQLWrapper } from 'drizzle-orm';
import z from 'zod';

import { AgentSchema, AgentUpdateSchema } from '@/modules/agents/schema';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '@/config';
import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { createTRPCRouter, premiumProcedure, protectedProcedure } from '@/trpc/init';

export const agentsRouter = createTRPCRouter({
	create: premiumProcedure('agents')
		.input(AgentSchema)
		.mutation(async ({ ctx, input }) => {
			const { instructions, name } = input;
			const {
				auth: { user },
			} = ctx;

			const [agent] = await db.insert(agents).values({ instructions, name, userId: user.id }).returning();

			return agent;
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

			const where: (SQLWrapper | undefined)[] = [eq(agents.userId, user.id)];

			if (!!search) where.push(ilike(agents.name, `%${search}%`));

			const data = await db
				.select({
					...getTableColumns(agents),
					meetingCount: db.$count(meetings, eq(agents.id, meetings.agentId)),
				})
				.from(agents)
				.where(and(...where))
				.orderBy(desc(agents.createdAt), desc(agents.id))
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			const totalAgents = await db.$count(agents, and(...where));

			const totalPages = Math.ceil(totalAgents / pageSize);

			return {
				items: data,
				total: totalAgents,
				totalPages,
			};
		}),
	getOne: protectedProcedure.input(z.object({ id: z.string().trim().min(1) })).query(async ({ ctx, input }) => {
		const {
			auth: { user },
		} = ctx;
		const { id: agentId } = input;

		const [agent] = await db
			.select({
				...getTableColumns(agents),
				meetingCount: db.$count(meetings, eq(agents.id, meetings.agentId)),
			})
			.from(agents)
			.where(and(eq(agents.id, agentId), eq(agents.userId, user.id)));

		if (!agent) throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found!' });

		return agent;
	}),
	remove: protectedProcedure.input(z.object({ id: z.string().trim().min(1) })).mutation(async ({ ctx, input }) => {
		const {
			auth: { user },
		} = ctx;
		const { id: agentId } = input;

		const [agent] = await db
			.delete(agents)
			.where(and(eq(agents.id, agentId), eq(agents.userId, user.id)))
			.returning();

		if (!agent) throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found!' });

		return agent;
	}),
	update: protectedProcedure.input(AgentUpdateSchema).mutation(async ({ ctx, input }) => {
		const {
			auth: { user },
		} = ctx;
		const { id: agentId, instructions, name } = input;

		const [agent] = await db
			.update(agents)
			.set({
				instructions,
				name,
			})
			.where(and(eq(agents.id, agentId), eq(agents.userId, user.id)))
			.returning();

		if (!agent) throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found!' });

		return agent;
	}),
});
