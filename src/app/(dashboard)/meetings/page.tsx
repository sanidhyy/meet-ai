import { Suspense } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';
import { ErrorBoundary } from 'react-error-boundary';

import { loadSearchParams } from '@/modules/meetings/server/params';
import { MeetingsListHeader } from '@/modules/meetings/ui/components/meetings-list-header';
import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from '@/modules/meetings/ui/views/meetings-view';

import { auth } from '@/lib/auth';
import { getQueryClient, trpc } from '@/trpc/server';

export const metadata: Metadata = {
	title: 'Meetings',
};

interface MeetingsPageProps {
	searchParams: Promise<SearchParams>;
}

const MeetingsPage = async ({ searchParams }: MeetingsPageProps) => {
	const filters = await loadSearchParams(searchParams);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect('/sign-in');

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions(filters));

	return (
		<>
			<MeetingsListHeader />

			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<MeetingsViewLoading />}>
					<ErrorBoundary FallbackComponent={MeetingsViewError}>
						<MeetingsView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	);
};

export default MeetingsPage;
