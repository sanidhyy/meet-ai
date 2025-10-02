import Link from 'next/link';

import { BanIcon, VideoIcon } from 'lucide-react';

import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';

interface UpcomingStateProps {
	meetingId: string;
	onCancelMeeting: () => void;
	isCancelling: boolean;
}

export const UpcomingState = ({ meetingId, onCancelMeeting, isCancelling }: UpcomingStateProps) => {
	return (
		<div className='flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5'>
			<EmptyState
				title='Not started yet'
				description='Once you start this meeting, a summary will appear here.'
				imageSrc='/upcoming.svg'
				imageAlt='Upcoming'
			/>

			<div className='flex w-full flex-col-reverse items-center gap-2 lg:flex-row lg:justify-center'>
				<Button
					onClick={onCancelMeeting}
					disabled={isCancelling}
					isLoading={isCancelling}
					variant='secondary'
					className='w-full lg:w-auto'
				>
					<BanIcon />
					Cancel meeting
				</Button>

				<Button disabled={isCancelling} className='w-full lg:w-auto' asChild>
					<Link href={`/call/${meetingId}`}>
						<VideoIcon />
						Start meeting
					</Link>
				</Button>
			</div>
		</div>
	);
};
