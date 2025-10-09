'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { VideoIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { AgentViewHeader } from '@/modules/agents/ui/components/agent-view-header';
import { UpdateAgentDialog } from '@/modules/agents/ui/components/update-agent-dialog';

import { ErrorState } from '@/components/error-state';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { LoadingState } from '@/components/loading-state';
import { Badge } from '@/components/ui/badge';
import { useConfirm } from '@/hooks/use-confirm';
import { useTRPC } from '@/trpc/client';
import type { ErrorFallbackProps } from '@/types';

interface AgentViewProps {
	agentId: string;
}

export const AgentView = ({ agentId }: AgentViewProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const trpc = useTRPC();
	const { data: agent } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

	const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);
	const [ConfirmDialog, confirm] = useConfirm({
		message: `Are you sure you want to delete this agent? This will remove ${agent.meetingCount} associated meetings. This action cannot be undone.`,
		title: `Delete agent ${agent.name}`,
	});

	const removeAgent = useMutation(
		trpc.agents.remove.mutationOptions({
			onError: (error) => {
				toast.error(error.message || 'Failed to remove the agent!');
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());
				await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());

				router.push('/agents');
			},
		})
	);

	const handleRemoveAgent = async () => {
		const ok = await confirm();
		if (!ok) return;

		await removeAgent.mutateAsync({ id: agentId });
	};

	const isPending = removeAgent.isPending;

	return (
		<>
			<ConfirmDialog />
			<UpdateAgentDialog initialValues={agent} open={updateAgentDialogOpen} onOpenChange={setUpdateAgentDialogOpen} />

			<div className='flex flex-1 flex-col gap-y-4 p-4 md:px-8'>
				<AgentViewHeader
					agentName={agent.name}
					onEdit={() => setUpdateAgentDialogOpen(true)}
					onRemove={handleRemoveAgent}
					isPending={isPending}
				/>

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
		</>
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
