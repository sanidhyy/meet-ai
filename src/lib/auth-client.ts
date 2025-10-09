import { polarClient } from '@polar-sh/better-auth';
import { oneTapClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { env } from '@/env/client';

export const { useSession, signIn, signUp, signOut, oneTap } = createAuthClient({
	plugins: [
		oneTapClient({
			autoSelect: false,
			cancelOnTapOutside: false,
			clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
		}),
		polarClient(),
	],
});
