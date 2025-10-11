import { Suspense } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { TRPCError } from '@trpc/server';
import { ErrorBoundary } from 'react-error-boundary';

import { CallView, CallViewError, CallViewLoading } from '@/modules/call/ui/views/call-view';

import { auth } from '@/lib/auth';
import { appRouter } from '@/trpc/routers/_app';
import { getQueryClient, trpc } from '@/trpc/server';

interface CallMeetingIdPageProps {
	params: Promise<{
		meetingId: string;
	}>;
}

export const generateMetadata = async ({ params }: CallMeetingIdPageProps): Promise<Metadata> => {
	const { meetingId } = await params;

	const caller = appRouter.createCaller({});

	let meetingName = 'Meeting';

	try {
		const meeting = await caller.meetings.getOne({ id: meetingId });
		meetingName = meeting.name;
	} catch (error) {
		if (error instanceof TRPCError) meetingName = error.message;
	}

	return {
		title: `Start Meeting - ${meetingName}`,
	};
};

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
			<Suspense fallback={<CallViewLoading />}>
				<ErrorBoundary FallbackComponent={CallViewError}>
					<CallView meetingId={meetingId} />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default CallMeetingIdPage;
