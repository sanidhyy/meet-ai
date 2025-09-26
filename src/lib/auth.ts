import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { env } from '@/env/server';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		debugLogs: env.NODE_ENV !== 'production',
		provider: 'pg',
		schema,
		usePlural: true,
	}),
	emailAndPassword: {
		enabled: true,
	},
});
