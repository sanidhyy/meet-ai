'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import {
	CircleCheckIcon,
	CircleXIcon,
	ClockArrowUpIcon,
	ClockFadingIcon,
	CornerDownRightIcon,
	Loader2Icon,
	VideoIcon,
	type LucideIcon,
} from 'lucide-react';

import type { MeetingGetMany } from '@/modules/meetings/types';

import { GeneratedAvatar } from '@/components/generated-avatar';
import { Badge } from '@/components/ui/badge';
import { MeetingStatus } from '@/db/schema';
import { cn, formatDuration } from '@/lib/utils';

type Meeting = MeetingGetMany['items'][number];

const statusIconMap: Record<MeetingStatus, LucideIcon> = {
	[MeetingStatus.UPCOMING]: ClockArrowUpIcon,
	[MeetingStatus.ACTIVE]: VideoIcon,
	[MeetingStatus.COMPLETED]: CircleCheckIcon,
	[MeetingStatus.PROCESSING]: Loader2Icon,
	[MeetingStatus.CANCELLED]: CircleXIcon,
};

const statusColorMap: Record<MeetingStatus, string> = {
	[MeetingStatus.UPCOMING]: 'bg-yellow-500/20 text-yellow-800 border-yellow-800/5',
	[MeetingStatus.ACTIVE]: 'bg-blue-500/20 text-blue-800 border-blue-800/5',
	[MeetingStatus.COMPLETED]: 'bg-emerald-500/20 text-emerald-800 border-emerald-800/5',
	[MeetingStatus.PROCESSING]: 'bg-gray-300/20 text-gray-800 border-gray-800/5',
	[MeetingStatus.CANCELLED]: 'bg-rose-500/20 text-rose-800 border-rose-800/5',
};

export const columns: ColumnDef<Meeting>[] = [
	{
		accessorKey: 'name',
		cell: ({ row }) => (
			<div className='flex flex-col gap-y-1'>
				<span className='font-semibold capitalize'>{row.original.name}</span>

				<div className='flex items-center gap-x-2'>
					<div className='flex items-center gap-x-1'>
						<CornerDownRightIcon className='text-muted-foreground size-3' />

						<span className='text-muted-foreground max-w-[200px] truncate text-sm'>{row.original.agent.name}</span>
					</div>

					<GeneratedAvatar variant='botttsNeutral' seed={row.original.agent.name} className='size-4' />

					<span className='text-muted-foreground text-sm'>
						{row.original.startedAt ? formatDate(row.original.startedAt, 'MMM d') : ''}
					</span>
				</div>
			</div>
		),
		header: 'Meeting Name',
	},
	{
		accessorKey: 'status',
		cell: ({ row }) => {
			const Icon = statusIconMap[row.original.status];

			return (
				<Badge
					variant='outline'
					className={cn('text-muted-foreground capitalize [&_svg]:size-4', statusColorMap[row.original.status])}
				>
					<Icon className={cn(row.original.status === MeetingStatus.PROCESSING && 'animate-spin')} />

					{row.original.status}
				</Badge>
			);
		},
		header: 'Status',
	},
	{
		accessorKey: 'duration',
		cell: ({ row }) => (
			<Badge variant='outline' className='flex items-center gap-x-2 capitalize [&_svg]:size-4'>
				<ClockFadingIcon className='text-blue-700' />
				{row.original.duration ? formatDuration(row.original.duration) : 'No duration'}
			</Badge>
		),
		header: 'Duration',
	},
];
