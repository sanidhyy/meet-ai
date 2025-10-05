import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	client: {
		NEXT_PUBLIC_APP_BASE_URL: z.url(),
		NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().trim().min(1),
		NEXT_PUBLIC_STREAM_CHAT_API_KEY: z.string().trim().min(1),
		NEXT_PUBLIC_STREAM_VIDEO_API_KEY: z.string().trim().min(1),
	},
	emptyStringAsUndefined: true,
	isServer: typeof window === undefined,
	onInvalidAccess: (variable: string) => {
		console.error('❌ Attempted to access a server-side environment variable on the client: ', variable);
		throw new Error('❌ Attempted to access a server-side environment variable on the client');
	},
	onValidationError: (issues) => {
		console.error('❌ Invalid environment variables:', issues);

		throw new Error('❌ Invalid environment variables');
	},
	runtimeEnv: {
		NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
		NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
		NEXT_PUBLIC_STREAM_CHAT_API_KEY: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY,
		NEXT_PUBLIC_STREAM_VIDEO_API_KEY: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY,
	},
});
