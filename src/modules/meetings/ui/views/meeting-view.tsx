'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ActiveState } from '@/modules/meetings/ui/components/active-state';
import { CancelledState } from '@/modules/meetings/ui/components/cancelled-state';
import { CompletedState } from '@/modules/meetings/ui/components/completed-state';
import { MeetingViewHeader } from '@/modules/meetings/ui/components/meeting-view-header';
import { ProcessingState } from '@/modules/meetings/ui/components/processing-state';
import { UpcomingState } from '@/modules/meetings/ui/components/upcoming-state';
import { UpdateMeetingDialog } from '@/modules/meetings/ui/components/update-meeting-dialog';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { MeetingStatus } from '@/db/schema';
import { useConfirm } from '@/hooks/use-confirm';
import { useTRPC } from '@/trpc/client';
import type { ErrorFallbackProps } from '@/types';

interface MeetingViewProps {
	meetingId: string;
}

export const MeetingView = ({ meetingId }: MeetingViewProps) => {
	const trpc = useTRPC();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: meeting } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

	const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

	const [ConfirmDialog, confirm] = useConfirm({
		message: 'Are you sure you want to delete this meeting? This action cannot be undone.',
		title: `Delete meeting ${meeting.name}`,
	});

	const removeMeeting = useMutation(
		trpc.meetings.remove.mutationOptions({
			onError: (error) => {
				toast.error(error.message || 'Failed to remove the meeting!');
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions());
				await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());

				router.push('/meetings');
			},
		})
	);

	const handleRemoveMeeting = async () => {
		const ok = await confirm();
		if (!ok) return;

		await removeMeeting.mutateAsync({ id: meetingId });
	};

	const isPending = removeMeeting.isPending;

	const MeetingViewContent = () => {
		switch (meeting.status) {
			case MeetingStatus.CANCELLED:
				return <CancelledState />;
			case MeetingStatus.PROCESSING:
				return <ProcessingState />;
			case MeetingStatus.COMPLETED:
				return <CompletedState data={meeting} />;
			case MeetingStatus.ACTIVE:
				return <ActiveState meetingId={meetingId} />;
			case MeetingStatus.UPCOMING:
				return <UpcomingState meetingId={meetingId} />;
		}
	};

	return (
		<>
			<ConfirmDialog />
			<UpdateMeetingDialog
				initialValues={meeting}
				open={updateMeetingDialogOpen}
				onOpenChange={setUpdateMeetingDialogOpen}
			/>

			<div className='flex flex-1 flex-col gap-y-4 p-4 md:px-8'>
				<MeetingViewHeader
					meetingName={meeting.name}
					onEdit={() => setUpdateMeetingDialogOpen(true)}
					onRemove={handleRemoveMeeting}
					isPending={isPending}
				/>
				<MeetingViewContent />
			</div>
		</>
	);
};

export const MeetingViewLoading = () => {
	return <LoadingState title='Loading Meeting' description='This may take a few seconds.' />;
};

export const MeetingViewError = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
	return (
		<ErrorState
			title='Failed to load meeting'
			description={error?.message || 'Something went wrong.'}
			onRetry={resetErrorBoundary}
		/>
	);
};
