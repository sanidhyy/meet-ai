import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import { MeetingView, MeetingViewError, MeetingViewLoading } from '@/modules/meetings/ui/views/meeting-view';

import { auth } from '@/lib/auth';
import { getQueryClient, trpc } from '@/trpc/server';

interface MeetingIdPageProps {
	params: Promise<{
		meetingId: string;
	}>;
}

const MeetingIdPage = async ({ params }: MeetingIdPageProps) => {
	const { meetingId } = await params;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect('/sign-in');

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));
	void queryClient.prefetchQuery(trpc.settings.getAISettings.queryOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<MeetingViewLoading />}>
				<ErrorBoundary FallbackComponent={MeetingViewError}>
					<MeetingView meetingId={meetingId} />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default MeetingIdPage;
