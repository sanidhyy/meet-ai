import type { MeetingGetOne } from '@/modules/meetings/types';

import { ResponsiveDialog } from '@/components/responsive-dialog';

import { MeetingForm } from './meeting-form';

interface UpdateMeetingDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialValues: MeetingGetOne;
}

export const UpdateMeetingDialog = ({ open, onOpenChange, initialValues }: UpdateMeetingDialogProps) => {
	return (
		<ResponsiveDialog
			title='Edit Meeting'
			description='Edit the meeting details'
			open={open}
			onOpenChange={onOpenChange}
		>
			<MeetingForm
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
				initialValues={initialValues}
			/>
		</ResponsiveDialog>
	);
};
