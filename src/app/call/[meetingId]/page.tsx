import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { CallView } from '@/modules/call/ui/views/call-view';

import { auth } from '@/lib/auth';
import { getQueryClient, trpc } from '@/trpc/server';

interface CallMeetingIdPageProps {
	params: Promise<{
		meetingId: string;
	}>;
}

const CallMeetingIdPage = async ({ params }: CallMeetingIdPageProps) => {
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
			<CallView meetingId={meetingId} />
		</HydrationBoundary>
	);
};

export default CallMeetingIdPage;
