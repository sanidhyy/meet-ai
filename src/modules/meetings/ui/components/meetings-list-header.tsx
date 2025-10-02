'use client';

import { useState } from 'react';

import { PlusIcon, XCircleIcon } from 'lucide-react';

import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters';

import { Button } from '@/components/ui/button';
import { DEFAULT_PAGE } from '@/config';

import { MeetingsAgentFilter } from './meetings-agent-filter';
import { MeetingsSearchFilter } from './meetings-search-filter';
import { MeetingsStatusFilter } from './meetings-status-filter';
import { NewMeetingDialog } from './new-meeting-dialog';

export const MeetingsListHeader = () => {
	const [filters, setFilters] = useMeetingsFilters();
	const [isNewMeetingDialogOpen, setIsNewMeetingDialogOpen] = useState(false);
	const [inputSearch, setInputSearch] = useState(filters.search);

	const isAnyFilterModified = !!filters.status || !!filters.search || !!filters.agentId;

	const onClearFilters = () => {
		setFilters({
			agentId: '',
			page: DEFAULT_PAGE,
			search: '',
			status: null,
		});
		setInputSearch('');
	};

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
					<MeetingsSearchFilter inputSearch={inputSearch} setInputSearch={setInputSearch} />
					<MeetingsStatusFilter />
					<MeetingsAgentFilter />

					{isAnyFilterModified && (
						<Button variant='outline' size='sm' onClick={onClearFilters}>
							<XCircleIcon />
							Clear
						</Button>
					)}
				</div>
			</div>
		</>
	);
};
