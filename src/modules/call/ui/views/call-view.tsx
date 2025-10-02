'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { CallProvider } from '@/modules/call/ui/components/call-provider';

import { ErrorState } from '@/components/error-state';
import { MeetingStatus } from '@/db/schema';
import { useTRPC } from '@/trpc/client';

interface CallViewProps {
	meetingId: string;
}

export const CallView = ({ meetingId }: CallViewProps) => {
	const trpc = useTRPC();

	const { data: meeting } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

	if (meeting.status === MeetingStatus.COMPLETED) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<ErrorState title='Meeting has ended' description='You can no longer join this meeting.' />
			</div>
		);
	}

	return <CallProvider meetingId={meetingId} meetingName={meeting.name} />;
};
