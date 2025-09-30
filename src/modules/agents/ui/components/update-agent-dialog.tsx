import { AgentGetOne } from '@/modules/agents/types';

import { ResponsiveDialog } from '@/components/responsive-dialog';

import { AgentForm } from './agent-form';

interface UpdateAgentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialValues: AgentGetOne;
}

export const UpdateAgentDialog = ({ initialValues, open, onOpenChange }: UpdateAgentDialogProps) => {
	return (
		<ResponsiveDialog title='Edit Agent' description='Edit the agent details' open={open} onOpenChange={onOpenChange}>
			<AgentForm
				initialValues={initialValues}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ResponsiveDialog>
	);
};
