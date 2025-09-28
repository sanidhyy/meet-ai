import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HomeView } from '@/modules/home/ui/views/home-view';

import { auth } from '@/lib/auth';
import { caller } from '@/trpc/server';

const HomePage = async () => {
	const data = await caller.hello({ text: 'Test Server' });
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect('/sign-in');

	return (
		<div className='flex flex-col gap-y-4 p-2'>
			{data.greeting}

			<HomeView />
		</div>
	);
};

export default HomePage;
