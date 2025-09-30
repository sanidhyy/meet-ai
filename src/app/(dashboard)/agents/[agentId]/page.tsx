import { Suspense } from 'react';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import { AgentView, AgentViewError, AgentViewLoading } from '@/modules/agents/ui/views/agent-view';

import { getQueryClient, trpc } from '@/trpc/server';

interface AgentIdPageProps {
	params: Promise<{ agentId: string }>;
}

const AgentIdPage = async ({ params }: AgentIdPageProps) => {
	const { agentId } = await params;

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<AgentViewLoading />}>
				<ErrorBoundary FallbackComponent={AgentViewError}>
					<AgentView agentId={agentId} />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default AgentIdPage;
