import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { SignInView } from '@/modules/auth/ui/views/sign-in-view';

import { auth } from '@/lib/auth';

const SignInPage = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!!session) redirect('/');

	return <SignInView />;
};
export default SignInPage;
