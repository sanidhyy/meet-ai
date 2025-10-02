'use client';

import { useState } from 'react';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { MeetingsAgentFilter } from './meetings-agent-filter';
import { MeetingsSearchFilter } from './meetings-search-filter';
import { MeetingsStatusFilter } from './meetings-status-filter';
import { NewMeetingDialog } from './new-meeting-dialog';

export const MeetingsListHeader = () => {
	const [isNewMeetingDialogOpen, setIsNewMeetingDialogOpen] = useState(false);

	return (
		<>
			<NewMeetingDialog open={isNewMeetingDialogOpen} onOpenChange={setIsNewMeetingDialogOpen} />

			<div className='flex flex-col gap-y-4 p-4 md:px-8'>
				<div className='flex items-center justify-between'>
					<h5 className='text-xl font-medium'>My Meetings</h5>
					<Button onClick={() => setIsNewMeetingDialogOpen(true)}>
						<PlusIcon />
						New Meeting
					</Button>
				</div>

				<div className='flex items-center gap-x-2 p-1'>
					<MeetingsSearchFilter />
					<MeetingsStatusFilter />
					<MeetingsAgentFilter />
				</div>
			</div>
		</>
	);
};
