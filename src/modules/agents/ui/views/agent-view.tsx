'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { VideoIcon } from 'lucide-react';

import { AgentViewHeader } from '@/modules/agents/ui/components/agent-view-header';

import { ErrorState } from '@/components/error-state';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { LoadingState } from '@/components/loading-state';
import { Badge } from '@/components/ui/badge';
import { useTRPC } from '@/trpc/client';
import type { ErrorFallbackProps } from '@/types';

interface AgentViewProps {
	agentId: string;
}

export const AgentView = ({ agentId }: AgentViewProps) => {
	const trpc = useTRPC();

	const { data: agent } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

	return (
		<div className='flex flex-1 flex-col gap-y-4 p-4 md:px-8'>
			<AgentViewHeader agentId={agentId} agentName={agent.name} onEdit={() => {}} onRemove={() => {}} />

			<div className='rounded-lg border bg-white'>
				<div className='col-span-5 flex flex-col gap-y-5 px-4 py-5'>
					<div className='flex items-center gap-x-3'>
						<GeneratedAvatar variant='botttsNeutral' seed={agent.name} className='size-10' />

						<h2 className='text-2xl font-medium'>{agent.name}</h2>
					</div>

					<Badge variant='outline' className='flex items-center gap-x-2 [&_svg]:size-4'>
						<VideoIcon className='text-blue-700' />
						{agent.meetingCount} meeting{agent.meetingCount === 1 ? '' : 's'}
					</Badge>

					<div className='flex flex-col gap-y-4'>
						<p className='text-lg font-medium'>Instructions</p>
						<p className='text-neutral-800'>{agent.instructions}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export const AgentViewLoading = () => {
	return <LoadingState title='Loading Agent' description='This may take a few seconds.' />;
};

export const AgentViewError = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
	return (
		<ErrorState
			title='Failed to load agent'
			description={error?.message || 'Something went wrong.'}
			onRetry={resetErrorBoundary}
		/>
	);
};
