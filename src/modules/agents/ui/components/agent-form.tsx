import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { AgentSchema } from '@/modules/agents/schema';
import { AgentGetOne } from '@/modules/agents/types';

import { GeneratedAvatar } from '@/components/generated-avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTRPC } from '@/trpc/client';

interface AgentFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
	initialValues?: AgentGetOne;
}

export const AgentForm = ({ initialValues, onCancel, onSuccess }: AgentFormProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const isEdit = !!initialValues?.id;

	const createAgent = useMutation(
		trpc.agents.create.mutationOptions({
			onError: (error) => {
				toast.error(error.message || `Failed to ${isEdit ? 'edit' : 'create'} the agent!`);

				// TODO: Check if error code is FORBIDDEN, redirect to /upgrade
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());

				if (isEdit) await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({ id: initialValues.id }));

				onSuccess?.();
			},
		})
	);

	const agentForm = useForm<z.infer<typeof AgentSchema>>({
		defaultValues: {
			instructions: initialValues?.instructions || '',
			name: initialValues?.name || '',
		},
		resolver: zodResolver(AgentSchema),
	});

	const handleSubmit = (values: z.infer<typeof AgentSchema>) => {
		if (isEdit) {
			// TODO: Implement update agent functionality
		} else {
			createAgent.mutate(values);
		}
	};

	const isPending = createAgent.isPending;

	return (
		<Form {...agentForm}>
			<form className='space-y-4' onSubmit={agentForm.handleSubmit(handleSubmit)}>
				<GeneratedAvatar seed={agentForm.watch('name')} variant='botttsNeutral' className='size-16 border' />

				<FormField
					disabled={isPending}
					control={agentForm.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>

							<FormControl>
								<Input type='text' placeholder='Math tutor' {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					disabled={isPending}
					control={agentForm.control}
					name='instructions'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Instructions</FormLabel>

							<FormControl>
								<Textarea
									placeholder='You are a helpful math assistant that can answer questions and help with assignments.'
									className='h-40 max-h-96'
									{...field}
								/>
							</FormControl>

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
	);
};
