import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';

import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters';

import { CommandSelect } from '@/components/command-select';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { useTRPC } from '@/trpc/client';

export const MeetingsAgentFilter = () => {
	const trpc = useTRPC();
	const [filters, setFilters] = useMeetingsFilters();

	const [agentSearch, setAgentSearch] = useState('');

	const { data: agents, isLoading } = useQuery(
		trpc.agents.getMany.queryOptions({
			pageSize: 50,
			search: agentSearch,
		})
	);

	const handleSearchChange = useMemo(
		() =>
			debounce((value: string) => {
				setAgentSearch(value);
			}, 400),
		[]
	);

	return (
		<CommandSelect
			className='h-9'
			placeholder='Agent'
			options={(agents?.items || []).map((agent) => ({
				children: (
					<div className='flex items-center gap-x-2'>
						<GeneratedAvatar variant='botttsNeutral' seed={agent.name} className='size-4' />
						{agent.name}
					</div>
				),
				id: agent.id,
				value: agent.id,
			}))}
			onSelect={(value) => setFilters({ agentId: value })}
			onSearch={handleSearchChange}
			isSearching={isLoading}
			value={filters.agentId || ''}
			emptyMessage='No agents found'
		/>
	);
};
