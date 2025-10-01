import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import { AgentView, AgentViewError, AgentViewLoading } from '@/modules/agents/ui/views/agent-view';

import { auth } from '@/lib/auth';
import { getQueryClient, trpc } from '@/trpc/server';

interface AgentIdPageProps {
	params: Promise<{ agentId: string }>;
}

const AgentIdPage = async ({ params }: AgentIdPageProps) => {
	const { agentId } = await params;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect('/sign-in');

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
