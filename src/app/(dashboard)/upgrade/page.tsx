import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import { UpgradeView, UpgradeViewError, UpgradeViewLoading } from '@/modules/premium/ui/views/upgrade-view';

import { auth } from '@/lib/auth';
import { getQueryClient, trpc } from '@/trpc/server';

const UpgradePage = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect('/sign-in');

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(trpc.premium.getProducts.queryOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<UpgradeViewLoading />}>
				<ErrorBoundary FallbackComponent={UpgradeViewError}>
					<UpgradeView />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default UpgradePage;
