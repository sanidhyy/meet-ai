import { z } from 'zod';

import { MAX_MEETING_NAME_LENGTH, MIN_MEETING_NAME_LENGTH } from '@/modules/meetings/config';

export const MeetingSchema = z.object({
	agentId: z.string().trim().min(1, 'Agent is required!'),
	name: z
		.string()
		.trim()
		.min(MIN_MEETING_NAME_LENGTH, `Name must be at least ${MIN_MEETING_NAME_LENGTH} characters!`)
		.max(MAX_MEETING_NAME_LENGTH, `Name cannot exceed ${MAX_MEETING_NAME_LENGTH} characters!`),
});

export const MeetingUpdateSchema = MeetingSchema.extend({
	id: z.string().trim().min(1, 'Id is required!'),
});
