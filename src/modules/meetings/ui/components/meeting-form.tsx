import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { NewAgentDialog } from '@/modules/agents/ui/components/new-agent-dialog';
import { MeetingSchema } from '@/modules/meetings/schema';
import type { MeetingGetOne } from '@/modules/meetings/types';

import { CommandSelect } from '@/components/command-select';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';

interface MeetingFormProps {
	onSuccess?: (id: string) => void;
	onCancel?: () => void;
	initialValues?: MeetingGetOne;
}

export const MeetingForm = ({ initialValues, onCancel, onSuccess }: MeetingFormProps) => {
	const router = useRouter();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
	const [agentSearch, setAgentSearch] = useState('');

	const { data: agents, isLoading } = useQuery(
		trpc.agents.getMany.queryOptions({
			pageSize: 50,
			search: agentSearch,
		})
	);

	const isEdit = !!initialValues?.id;

	const createMeeting = useMutation(
		trpc.meetings.create.mutationOptions({
			onError: (error) => {
				if (error.data?.code === 'PAYMENT_REQUIRED') return router.push('/upgrade');

				toast.error(error.message || 'Failed to create the meeting!');
			},
			onSuccess: async ({ id }) => {
				await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions());
				await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());

				onSuccess?.(id);
			},
		})
	);

	const updateMeeting = useMutation(
		trpc.meetings.update.mutationOptions({
			onError: (error) => {
				toast.error(error.message || 'Failed to edit the meeting!');
			},
			onSuccess: async ({ id }) => {
				await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions());

				if (isEdit) await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: initialValues.id }));

				onSuccess?.(id);
			},
		})
	);

	const meetingForm = useForm<z.infer<typeof MeetingSchema>>({
		defaultValues: {
			agentId: initialValues?.agentId || '',
			name: initialValues?.name || '',
		},
		resolver: zodResolver(MeetingSchema),
	});

	const handleSubmit = (values: z.infer<typeof MeetingSchema>) => {
		if (isEdit) {
			updateMeeting.mutate({ ...values, id: initialValues.id });
		} else {
			createMeeting.mutate(values);
		}
	};

	const handleSearchChange = useMemo(
		() =>
			debounce((value: string) => {
				setAgentSearch(value);
			}, 600),
		[]
	);

	const isPending = createMeeting.isPending || updateMeeting.isPending;

	return (
		<>
			<NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />

			<Form {...meetingForm}>
				<form className='space-y-4' onSubmit={meetingForm.handleSubmit(handleSubmit)}>
					<FormField
						disabled={isPending}
						control={meetingForm.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>

								<FormControl>
									<Input type='text' placeholder='Math Consultations' {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						disabled={isPending}
						control={meetingForm.control}
						name='agentId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Agent</FormLabel>

								<FormControl>
									<CommandSelect
										options={(agents?.items || []).map((agent) => ({
											children: (
												<div className='flex items-center gap-x-2'>
													<GeneratedAvatar variant='botttsNeutral' seed={agent.name} className='size-6 border' />
													<span>{agent.name}</span>
												</div>
											),
											id: agent.id,
											value: agent.id,
										}))}
										onSelect={field.onChange}
										onSearch={handleSearchChange}
										isSearching={isLoading}
										value={field.value}
										placeholder='Select an agent'
										emptyMessage='No agents found'
									/>
								</FormControl>

								<FormDescription>
									Not found what your&apos;re looking for?{' '}
									<button
										type='button'
										className='text-primary cursor-pointer underline-offset-4 hover:underline'
										onClick={() => setOpenNewAgentDialog(true)}
									>
										Create new agent
									</button>
								</FormDescription>

								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex justify-between gap-x-2'>
						{onCancel && (
							<Button type='button' variant='ghost' disabled={isPending} onClick={onCancel}>
								Cancel
							</Button>
						)}

						<Button isLoading={isPending} disabled={isPending} type='submit'>
							{isEdit ? 'Update' : 'Create'}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};
