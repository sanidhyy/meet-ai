import { cache } from 'react';

import { initTRPC } from '@trpc/server';

export const createTRPCContext = cache(async () => {
	return { userId: 'user_123' };
});

const t = initTRPC.create({
	// transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
