import { cache } from 'react';
import { headers } from 'next/headers';

import { TRPCError, initTRPC } from '@trpc/server';
import { eq } from 'drizzle-orm';
import superjson from 'superjson';

import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/config';

import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';

export const createTRPCContext = cache(async () => {
	return { userId: 'user_123' };
});

const t = initTRPC.create({
	transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized!' });

	return next({ ctx: { ...ctx, auth: session } });
});
export const premiumProcedure = (entity: 'agents' | 'meetings') =>
	protectedProcedure.use(async ({ ctx, next }) => {
		const {
			auth: { user },
		} = ctx;
		const customer = await polarClient.customers.getStateExternal({
			externalId: user.id,
		});

		const userAgentsCount = await db.$count(agents, eq(agents.userId, user.id));
		const userMeetingsCount = await db.$count(meetings, eq(meetings.userId, user.id));

		const isPremium = customer.activeSubscriptions.length > 0;
		const isFreeAgentLimitReached = userAgentsCount >= MAX_FREE_AGENTS;
		const isFreeMeetingLimitReached = userMeetingsCount >= MAX_FREE_MEETINGS;

		const shouldThrowAgentError = entity === 'agents' && isFreeAgentLimitReached && !isPremium;
		const shouldThrowMeetingError = entity === 'meetings' && isFreeMeetingLimitReached && !isPremium;

		if (shouldThrowAgentError)
			throw new TRPCError({ code: 'PAYMENT_REQUIRED', message: 'You have reached the maximum number of free agents!' });
		if (shouldThrowMeetingError)
			throw new TRPCError({
				code: 'PAYMENT_REQUIRED',
				message: 'You have reached the maximum number of free meetings!',
			});

		return next({ ctx: { ...ctx, customer } });
	});
