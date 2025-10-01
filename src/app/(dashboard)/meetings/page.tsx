import { Suspense } from 'react';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from '@/modules/meetings/ui/views/meetings-view';

import { getQueryClient, trpc } from '@/trpc/server';

const MeetingsPage = () => {
	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<MeetingsViewLoading />}>
				<ErrorBoundary FallbackComponent={MeetingsViewError}>
					<MeetingsView />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default MeetingsPage;
