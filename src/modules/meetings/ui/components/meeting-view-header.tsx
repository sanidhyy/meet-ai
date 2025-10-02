import Link from 'next/link';

import { ChevronRightIcon, MoreVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MeetingViewHeaderProps {
	meetingName: string;
	onEdit: () => void;
	onRemove: () => void;
	isPending: boolean;
}

export const MeetingViewHeader = ({ meetingName, onEdit, onRemove, isPending }: MeetingViewHeaderProps) => {
	return (
		<div className='flex items-center justify-between'>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink className='text-lg font-medium' asChild>
							<Link href='/meetings'>My Meetings</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>

					<BreadcrumbSeparator className='text-foreground text-xl font-medium [&_svg]:size-4'>
						<ChevronRightIcon />
					</BreadcrumbSeparator>

					<BreadcrumbItem>
						<BreadcrumbPage className='text-foreground text-lg font-medium'>{meetingName}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button disabled={isPending} isLoading={isPending} variant='ghost' className='hover:bg-background'>
						<MoreVerticalIcon />
						<span className='sr-only'>More options</span>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='end'>
					<DropdownMenuItem onClick={onEdit}>
						<PencilIcon className='text-black' />
						Edit
					</DropdownMenuItem>

					<DropdownMenuItem variant='destructive' onClick={onRemove}>
						<Trash2Icon />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
