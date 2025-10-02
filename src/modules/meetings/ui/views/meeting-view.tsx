'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { MeetingViewHeader } from '@/modules/meetings/ui/components/meeting-view-header';
import { UpdateMeetingDialog } from '@/modules/meetings/ui/components/update-meeting-dialog';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
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
			onSuccess: () => {
				queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions());
				// TODO: Invalidate free tier usage

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
				{JSON.stringify(meeting, null, 2)}
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
