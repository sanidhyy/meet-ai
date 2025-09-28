import 'server-only';

import { cache } from 'react';

import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';

import { appRouter } from '@/trpc/routers/_app';

import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
	ctx: createTRPCContext,
	queryClient: getQueryClient,
	router: appRouter,
});
export const caller = appRouter.createCaller(createTRPCContext);
