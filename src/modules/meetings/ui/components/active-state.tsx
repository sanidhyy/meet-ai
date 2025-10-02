import Link from 'next/link';

import { VideoIcon } from 'lucide-react';

import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';

interface ActiveStateProps {
	meetingId: string;
}

export const ActiveState = ({ meetingId }: ActiveStateProps) => {
	return (
		<div className='flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5'>
			<EmptyState
				title='Meeting is active'
				description='Meeting will end once all participants have left.'
				imageSrc='/upcoming.svg'
				imageAlt='Active'
			/>

			<div className='flex w-full flex-col-reverse items-center gap-2 lg:flex-row lg:justify-center'>
				<Button className='w-full lg:w-auto' asChild>
					<Link href={`/call/${meetingId}`}>
						<VideoIcon />
						Join meeting
					</Link>
				</Button>
			</div>
		</div>
	);
};
