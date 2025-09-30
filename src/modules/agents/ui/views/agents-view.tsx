'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { columns } from '@/modules/agents/ui/components/columns';
import { DataTable } from '@/modules/agents/ui/components/data-table';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import type { ErrorFallbackProps } from '@/types';

export const AgentsView = () => {
	const trpc = useTRPC();
	const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

	return (
		<div className='flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8'>
			{!!agents.length ? (
				<DataTable columns={columns} data={agents} />
			) : (
				<EmptyState
					title='Create your first agent'
					description='Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call.'
				/>
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
