import { useMemo } from 'react';

import debounce from 'lodash.debounce';
import { SearchIcon } from 'lucide-react';

import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters';

import { Input } from '@/components/ui/input';

interface MeetingsSearchFilterProps {
	inputSearch: string;
	setInputSearch: (inputSearch: string) => void;
}

export const MeetingsSearchFilter = ({ inputSearch, setInputSearch }: MeetingsSearchFilterProps) => {
	const [_filters, setFilters] = useMeetingsFilters();

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
