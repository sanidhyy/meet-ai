import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';
import { ErrorBoundary } from 'react-error-boundary';

import { loadSearchParams } from '@/modules/agents/server/params';
import { AgentsListHeader } from '@/modules/agents/ui/components/agents-list-header';
import { AgentsView, AgentsViewError, AgentsViewLoading } from '@/modules/agents/ui/views/agents-view';

import { auth } from '@/lib/auth';
import { getQueryClient, trpc } from '@/trpc/server';

interface AgentsPageProps {
	searchParams: Promise<SearchParams>;
}

const AgentsPage = async ({ searchParams }: AgentsPageProps) => {
	const filters = await loadSearchParams(searchParams);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect('/sign-in');

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(
		trpc.agents.getMany.queryOptions({
			...filters,
		})
	);

	return (
		<>
			<AgentsListHeader />

			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<AgentsViewLoading />}>
					<ErrorBoundary FallbackComponent={AgentsViewError}>
						<AgentsView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	);
};

export default AgentsPage;
