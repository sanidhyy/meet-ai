import { useMemo } from 'react';

import debounce from 'lodash.debounce';
import { SearchIcon } from 'lucide-react';

import { useAgentsFilters } from '@/modules/agents/hooks/use-agents-filters';

import { Input } from '@/components/ui/input';

interface AgentsSearchFilterProps {
	inputSearch: string;
	setInputSearch: (inputSearch: string) => void;
}

export const AgentsSearchFilter = ({ inputSearch, setInputSearch }: AgentsSearchFilterProps) => {
	const [_filters, setFilters] = useAgentsFilters();

	const handleSearchChange = useMemo(
		() =>
			debounce((value: string) => {
				setFilters({
					search: value,
				});
			}, 600),
		[setFilters]
	);

	return (
		<div className='relative'>
			<Input
				placeholder='Filter by name'
				className='h-9 w-[200px] bg-white pl-9'
				value={inputSearch}
				onChange={(e) => {
					setInputSearch(e.target.value);
					handleSearchChange(e.target.value);
				}}
			/>

			<SearchIcon className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
		</div>
	);
};
