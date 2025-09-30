import { TRPCError } from '@trpc/server';
import { and, desc, eq, getTableColumns, ilike, sql, type SQLWrapper } from 'drizzle-orm';
import z from 'zod';

import { AgentSchema } from '@/modules/agents/schema';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '@/config';
import { db } from '@/db';
import { agents } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const agentsRouter = createTRPCRouter({
	create: protectedProcedure.input(AgentSchema).mutation(async ({ ctx, input }) => {
		const { instructions, name } = input;
		const { auth } = ctx;

		const [agent] = await db.insert(agents).values({ instructions, name, userId: auth.user.id }).returning();

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
					meetingCount: sql<number>`5`, // TODO: Modify later
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
	getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		const {
			auth: { user },
		} = ctx;
		const { id: agentId } = input;

		const [agent] = await db
			.select({
				...getTableColumns(agents),
				meetingCount: sql<number>`5`, // TODO: Modify later
			})
			.from(agents)
			.where(and(eq(agents.id, agentId), eq(agents.userId, user.id)));

		if (!agent) throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found!' });

		return agent;
	}),
});
