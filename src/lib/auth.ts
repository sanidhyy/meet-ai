import { checkout, polar, portal } from '@polar-sh/better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { oneTap } from 'better-auth/plugins';

import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/modules/auth/config';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { env as clientEnv } from '@/env/client';
import { env } from '@/env/server';
import { polarClient } from '@/lib/polar';

export const auth = betterAuth({
	appName: 'Meet.AI',
	baseURL: clientEnv.NEXT_PUBLIC_APP_BASE_URL,
	database: drizzleAdapter(db, {
		debugLogs: env.NODE_ENV !== 'production',
		provider: 'pg',
		schema,
		usePlural: true,
	}),
	emailAndPassword: {
		enabled: true,
		maxPasswordLength: MAX_PASSWORD_LENGTH,
		minPasswordLength: MIN_PASSWORD_LENGTH,
	},
	onAPIError: {
		errorURL: '/sign-in',
	},
	plugins: [
		oneTap(),
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					authenticatedUsersOnly: true,
					successUrl: '/upgrade',
				}),
				portal(),
			],
		}),
	],
	secret: env.BETTER_AUTH_SECRET,
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
		google: {
			clientId: clientEnv.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
});
