import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HomeView } from '@/modules/home/ui/views/home-view';

import { auth } from '@/lib/auth';

const HomePage = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect('/sign-in');

	return <HomeView />;
};

export default HomePage;
