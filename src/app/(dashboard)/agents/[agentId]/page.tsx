import { Suspense } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { TRPCError } from '@trpc/server';
import { ErrorBoundary } from 'react-error-boundary';

import { AgentView, AgentViewError, AgentViewLoading } from '@/modules/agents/ui/views/agent-view';

import { auth } from '@/lib/auth';
import { appRouter } from '@/trpc/routers/_app';
import { getQueryClient, trpc } from '@/trpc/server';

interface AgentIdPageProps {
	params: Promise<{ agentId: string }>;
}

export const generateMetadata = async ({ params }: AgentIdPageProps): Promise<Metadata> => {
	const { agentId } = await params;

	const caller = appRouter.createCaller({});

	let agentName = 'Agent';

	try {
		const agent = await caller.agents.getOne({ id: agentId });
		agentName = agent.name;
	} catch (error) {
		if (error instanceof TRPCError) agentName = error.message;
	}

	return {
		title: agentName,
	};
};

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
