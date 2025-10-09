import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { polarClient } from '@/lib/polar';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const premiumRouter = createTRPCRouter({
	getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
		const {
			auth: { user },
		} = ctx;

		const customer = await polarClient.customers.getStateExternal({
			externalId: user.id,
		});

		const subscription = customer.activeSubscriptions?.[0];

		if (!!subscription) return null;

		const userAgentsCount = await db.$count(agents, eq(agents.userId, user.id));
		const userMeetingsCount = await db.$count(meetings, eq(meetings.userId, user.id));

		return {
			agentCount: userAgentsCount,
			meetingCount: userMeetingsCount,
		};
	}),
});
