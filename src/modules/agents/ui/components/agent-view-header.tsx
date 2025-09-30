import Link from 'next/link';

import { ChevronRightIcon, MoreVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AgentViewHeaderProps {
	agentId: string;
	agentName: string;
	onEdit: () => void;
	onRemove: () => void;
}

export const AgentViewHeader = ({ agentId, agentName, onEdit, onRemove }: AgentViewHeaderProps) => {
	return (
		<div className='flex items-center justify-between'>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink className='text-lg font-medium' asChild>
							<Link href='/agents'>My Agents</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>

					<BreadcrumbSeparator className='text-foreground text-xl font-medium [&_svg]:size-4'>
						<ChevronRightIcon />
					</BreadcrumbSeparator>

					<BreadcrumbItem>
						<BreadcrumbLink className='text-foreground text-lg font-medium' asChild>
							<Link href={`/agents/${agentId}`}>{agentName}</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='hover:bg-background'>
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
