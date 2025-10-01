'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import type { ErrorFallbackProps } from '@/types';

export const MeetingsView = () => {
	const trpc = useTRPC();

	const { data: meetings } = useSuspenseQuery(trpc.meetings.getMany.queryOptions());

	return <div>{JSON.stringify(meetings, null, 2)}</div>;
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
