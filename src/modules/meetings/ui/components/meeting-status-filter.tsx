import { CircleCheckIcon, CircleXIcon, ClockArrowUpIcon, LoaderIcon, VideoIcon, type LucideIcon } from 'lucide-react';

import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters';

import { CommandSelect } from '@/components/command-select';
import { MeetingStatus } from '@/db/schema';

const statusIconMap: Record<MeetingStatus, LucideIcon> = {
	[MeetingStatus.UPCOMING]: ClockArrowUpIcon,
	[MeetingStatus.ACTIVE]: VideoIcon,
	[MeetingStatus.COMPLETED]: CircleCheckIcon,
	[MeetingStatus.PROCESSING]: LoaderIcon,
	[MeetingStatus.CANCELLED]: CircleXIcon,
};

export const MeetingStatusFilter = () => {
	const [filters, setFilters] = useMeetingsFilters();

	return (
		<CommandSelect
			placeholder='Status'
			className='h-9'
			options={Object.entries(statusIconMap).map(([id, Icon]) => ({
				children: (
					<div className='flex items-center gap-x-2 capitalize'>
						<Icon />
						{id}
					</div>
				),
				id,
				value: id,
			}))}
			onSelect={(value) =>
				setFilters({
					status: Object.values(MeetingStatus).includes(value as MeetingStatus)
						? (value as MeetingStatus)
						: MeetingStatus.UPCOMING,
				})
			}
			value={filters.status || ''}
		/>
	);
};
