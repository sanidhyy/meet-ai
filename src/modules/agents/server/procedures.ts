import { eq, getTableColumns, sql } from 'drizzle-orm';
import z from 'zod';

import { AgentSchema } from '@/modules/agents/schema';

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
	getMany: protectedProcedure.query(async () => {
		const data = await db
			.select({
				...getTableColumns(agents),
				meetingCount: sql<number>`5`, // TODO: Modify later
			})
			.from(agents);

		return data;
	}),
	getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
		const { id: agentId } = input;
		const [agent] = await db
			.select({
				...getTableColumns(agents),
				meetingCount: sql<number>`5`, // TODO: Modify later
			})
			.from(agents)
			.where(eq(agents.id, agentId));

		return agent;
	}),
});
