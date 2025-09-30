import { z } from 'zod';

import {
	MAX_AGENT_INSTRUCTIONS_LENGTH,
	MAX_AGENT_NAME_LENGTH,
	MIN_AGENT_INSTRUCTIONS_LENGTH,
	MIN_AGENT_NAME_LENGTH,
} from '@/modules/agents/config';

export const AgentSchema = z.object({
	instructions: z
		.string()
		.trim()
		.min(MIN_AGENT_INSTRUCTIONS_LENGTH, `Instructions must be at least ${MIN_AGENT_INSTRUCTIONS_LENGTH} characters!`)
		.max(MAX_AGENT_INSTRUCTIONS_LENGTH, `Instructions cannot exceed ${MAX_AGENT_INSTRUCTIONS_LENGTH} characters!`),
	name: z
		.string()
		.trim()
		.min(MIN_AGENT_NAME_LENGTH, `Name must be at least ${MIN_AGENT_NAME_LENGTH} characters!`)
		.max(MAX_AGENT_NAME_LENGTH, `Name cannot exceed ${MAX_AGENT_NAME_LENGTH} characters!`),
});

export const AgentUpdateSchema = AgentSchema.extend({
	id: z.string().min(1, 'Id is required!'),
});
