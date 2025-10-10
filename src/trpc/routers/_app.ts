import { agentsRouter } from '@/modules/agents/server/procedures';
import { meetingsRouter } from '@/modules/meetings/server/procedures';
import { premiumRouter } from '@/modules/premium/server/procedures';
import { settingsRouter } from '@/modules/settings/server/procedures';

import { createTRPCRouter } from '@/trpc/init';

export const appRouter = createTRPCRouter({
	agents: agentsRouter,
	meetings: meetingsRouter,
	premium: premiumRouter,
	settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
