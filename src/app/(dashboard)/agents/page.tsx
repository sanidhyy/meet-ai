import { Suspense } from 'react';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import { AgentsView, AgentsViewError, AgentsViewLoading } from '@/modules/agents/ui/views/agent-view';

import { getQueryClient, trpc } from '@/trpc/server';

const AgentsPage = async () => {
	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<AgentsViewLoading />}>
				<ErrorBoundary FallbackComponent={AgentsViewError}>
					<AgentsView />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default AgentsPage;
