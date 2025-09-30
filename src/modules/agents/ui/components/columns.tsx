'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CornerDownRightIcon, VideoIcon } from 'lucide-react';

import { AgentGetOne } from '@/modules/agents/types';

import { GeneratedAvatar } from '@/components/generated-avatar';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<AgentGetOne>[] = [
	{
		accessorKey: 'name',
		cell: ({ row }) => (
			<div className='flex flex-col gap-y-1'>
				<div className='flex items-center gap-x-2'>
					<GeneratedAvatar variant='botttsNeutral' seed={row.original.name} className='size-6' />

					<span className='font-semibold'>{row.original.name}</span>
				</div>

				<div className='flex items-center gap-x-1.5'>
					<CornerDownRightIcon className='text-muted-foreground size-3' />

					<span className='text-muted-foreground max-w-[200px] truncate text-sm'>{row.original.instructions}</span>
				</div>
			</div>
		),
		header: 'Agent Name',
	},
	{
		accessorKey: 'meetingCount',
		cell: ({ row }) => (
			<Badge variant='outline' className='flex items-center gap-x-2 [&_svg]:size-4'>
				<VideoIcon className='text-blue-700' />
				{row.original.meetingCount} meeting{row.original.meetingCount === 1 ? '' : 's'}
			</Badge>
		),
		header: 'Meetings',
	},
];
