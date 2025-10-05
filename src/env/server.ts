import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from '@t3-oss/env-nextjs/presets-zod';
import { z } from 'zod';

export const env = createEnv({
	emptyStringAsUndefined: true,
	// eslint-disable-next-line camelcase
	experimental__runtimeEnv: process.env,
	extends: [vercel()],
	onInvalidAccess: (variable: string) => {
		console.error('❌ Attempted to access a server-side environment variable on the client: ', variable);
		throw new Error('❌ Attempted to access a server-side environment variable on the client');
	},
	onValidationError: (issues) => {
		console.error('❌ Invalid environment variables:', issues);

		throw new Error('❌ Invalid environment variables');
	},
	server: {
		BETTER_AUTH_SECRET: z.string().trim().min(1),
		DATABASE_URL: z.url(),
		GITHUB_CLIENT_ID: z.string().trim().min(1),
		GITHUB_CLIENT_SECRET: z.string().trim().min(1),
		GOOGLE_CLIENT_SECRET: z.string().trim().min(1),
		NODE_ENV: z.enum(['development', 'production', 'test']).default('development').optional(),
		OPENAI_API_KEY: z.string().trim().min(1).startsWith('sk-proj-'),
		STREAM_CHAT_API_SECRET: z.string().trim().min(1),
		STREAM_VIDEO_API_SECRET: z.string().trim().min(1),
	},
});
