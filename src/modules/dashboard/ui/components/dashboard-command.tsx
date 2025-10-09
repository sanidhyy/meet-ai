import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { Loader2Icon } from 'lucide-react';

import { GeneratedAvatar } from '@/components/generated-avatar';
import {
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandResponsiveDialog,
} from '@/components/ui/command';
import { useTRPC } from '@/trpc/client';

interface DashboardCommandProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
	const router = useRouter();
	const trpc = useTRPC();
	const [search, setSearch] = useState('');

	const { data: agents, isLoading: isAgentsLoading } = useQuery(
		trpc.agents.getMany.queryOptions({
			pageSize: 50,
			search,
		})
	);

	const { data: meetings, isLoading: isMeetingsLoading } = useQuery(
		trpc.meetings.getMany.queryOptions({
			pageSize: 50,
			search,
		})
	);

	const handleSearchChange = useMemo(
		() =>
			debounce((value: string) => {
				setSearch(value);
			}, 600),
		[]
	);

	const isLoading = isAgentsLoading || isMeetingsLoading;

	return (
		<CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
			<CommandInput
				placeholder='Find a meeting or agent...'
				value={search}
				onValueChange={(value) => {
					setSearch(value);
					handleSearchChange(value);
				}}
			/>

			<CommandList>
				{isLoading && (
					<CommandItem className='flex items-center justify-center'>
						<Loader2Icon className='my-12 size-4 animate-spin' strokeWidth={2.5} aria-label='Searching...' />
					</CommandItem>
				)}

				<CommandEmpty>
					<span className='text-muted-foreground text-sm'>No meetings/agents found</span>
				</CommandEmpty>

				{!isLoading && !!meetings?.items.length && (
					<CommandGroup heading='Meetings'>
						{meetings.items.map((meeting) => (
							<CommandItem
								key={meeting.id}
								onSelect={() => {
									router.push(`/meetings/${meeting.id}`);
									setOpen(false);
								}}
							>
								{meeting.name}
							</CommandItem>
						))}
					</CommandGroup>
				)}

				{!isLoading && !!agents?.items.length && (
					<CommandGroup heading='Agents'>
						{agents.items.map((agent) => (
							<CommandItem
								key={agent.id}
								onSelect={() => {
									router.push(`/agents/${agent.id}`);
									setOpen(false);
								}}
							>
								<GeneratedAvatar variant='botttsNeutral' seed={agent.name} className='size-5' />
								{agent.name}
							</CommandItem>
						))}
					</CommandGroup>
				)}
			</CommandList>
		</CommandResponsiveDialog>
	);
};
