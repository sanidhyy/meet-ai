'use client';

import { useRouter } from 'next/navigation';

import { useSuspenseQuery } from '@tanstack/react-query';

import { useAgentsFilters } from '@/modules/agents/hooks/use-agents-filters';
import { columns } from '@/modules/agents/ui/components/columns';
import { DataPagination } from '@/modules/agents/ui/components/data-pagination';

import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { DEFAULT_PAGE } from '@/config';
import { useTRPC } from '@/trpc/client';
import type { ErrorFallbackProps } from '@/types';

export const AgentsView = () => {
	const router = useRouter();
	const trpc = useTRPC();
	const [filters, setFilters] = useAgentsFilters();

	const { data: agents } = useSuspenseQuery(
		trpc.agents.getMany.queryOptions({
			...filters,
		})
	);

	return (
		<div className='flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8'>
			{!agents.total && filters.page === DEFAULT_PAGE && !filters.search ? (
				<EmptyState
					title='Create your first agent'
					description='Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call.'
				/>
			) : (
				<>
					<DataTable
						columns={columns}
						data={agents.items}
						onRowClick={(agent) => router.push(`/agents/${agent.id}`)}
						emptyMessage='No agents found.'
					/>
					<DataPagination
						page={filters.page}
						totalPages={agents.totalPages}
						onPageChange={(page) => setFilters({ page })}
					/>
				</>
			)}
		</div>
	);
};

export const AgentsViewLoading = () => {
	return <LoadingState title='Loading Agents' description='This may take a few seconds.' />;
};

export const AgentsViewError = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
	return (
		<ErrorState
			title='Failed to load agents'
			description={error?.message || 'Something went wrong.'}
			onRetry={resetErrorBoundary}
		/>
	);
};
