'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import type { ErrorFallbackProps } from '@/types';

export const AgentsView = () => {
	const trpc = useTRPC();
	const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

	return <div>{JSON.stringify(agents, null, 2)}</div>;
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
