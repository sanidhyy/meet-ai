'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { columns } from '@/modules/meetings/ui/components/columns';

import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import type { ErrorFallbackProps } from '@/types';

export const MeetingsView = () => {
	const trpc = useTRPC();

	const { data: meetings } = useSuspenseQuery(trpc.meetings.getMany.queryOptions());

	return (
		<div className='flex flex-1 flex-col gap-y-4 p-4 md:px-8'>
			{!meetings.total ? ( // TODO: Include filters condition here
				<EmptyState
					title='Create your first meeting'
					description='Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time.'
				/>
			) : (
				<DataTable columns={columns} data={meetings.items} />
			)}
		</div>
	);
};

export const MeetingsViewLoading = () => {
	return <LoadingState title='Loading Meetings' description='This may take a few seconds.' />;
};

export const MeetingsViewError = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
	return (
		<ErrorState
			title='Failed to load meetings'
			description={error?.message || 'Something went wrong.'}
			onRetry={resetErrorBoundary}
		/>
	);
};
