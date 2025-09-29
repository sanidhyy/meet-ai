'use client';

import { useState } from 'react';

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import superjson from 'superjson';

import { absoluteUrl } from '@/lib/utils';
import type { AppRouter } from '@/trpc/routers/_app';

import { makeQueryClient } from './query-client';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

const getQueryClient = () => {
	if (typeof window === 'undefined') {
		return makeQueryClient();
	}

	if (!browserQueryClient) browserQueryClient = makeQueryClient();

	return browserQueryClient;
};

export const TRPCReactProvider = (
	props: Readonly<{
		children: React.ReactNode;
	}>
) => {
	const queryClient = getQueryClient();

	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
			links: [
				httpBatchLink({
					transformer: superjson,
					url: absoluteUrl('/api/trpc'),
				}),
			],
		})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{props.children}
			</TRPCProvider>
		</QueryClientProvider>
	);
};
