'use client';

import { useState } from 'react';

import { PlusIcon, XCircleIcon } from 'lucide-react';

import { useAgentsFilters } from '@/modules/agents/hooks/use-agents-filters';

import { Button } from '@/components/ui/button';
import { DEFAULT_PAGE } from '@/config';

import { AgentsSearchFilter } from './agents-search-filter';
import { NewAgentDialog } from './new-agent-dialog';

export const AgentsListHeader = () => {
	const [filters, setFilters] = useAgentsFilters();
	const [isNewAgentDialogOpen, setIsNewAgentDialogOpen] = useState(false);

	const isAnyFilterModified = !!filters.search;

	const onClearFilters = () => {
		setFilters({
			page: DEFAULT_PAGE,
			search: '',
		});
	};

	return (
		<>
			<NewAgentDialog open={isNewAgentDialogOpen} onOpenChange={setIsNewAgentDialogOpen} />

			<div className='flex flex-col gap-y-4 p-4 md:px-8'>
				<div className='flex items-center justify-between'>
					<h5 className='text-xl font-medium'>My Agents</h5>
					<Button onClick={() => setIsNewAgentDialogOpen(true)}>
						<PlusIcon />
						New Agent
					</Button>
				</div>

				<div className='flex items-center gap-x-2 p-1'>
					<AgentsSearchFilter />

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
