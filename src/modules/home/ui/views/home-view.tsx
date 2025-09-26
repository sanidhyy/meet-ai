'use client';

import { signOut, useSession } from '@/lib/auth-client';

export const HomeView = () => {
	const { data: session } = useSession();

	if (!session) return null;

	return (
		<div>
			<pre>{JSON.stringify(session.user)}</pre>

			<br />
			<button onClick={() => signOut({})}>Sign out</button>
		</div>
	);
};
