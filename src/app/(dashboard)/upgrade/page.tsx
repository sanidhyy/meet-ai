import { Suspense } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { TRPCError } from '@trpc/server';
import { ErrorBoundary } from 'react-error-boundary';

import { UpgradeView, UpgradeViewError, UpgradeViewLoading } from '@/modules/premium/ui/views/upgrade-view';

import { auth } from '@/lib/auth';
import { appRouter } from '@/trpc/routers/_app';
import { getQueryClient, trpc } from '@/trpc/server';

export const generateMetadata = async (): Promise<Metadata> => {
	const caller = appRouter.createCaller({});

	let title = 'Upgrade';

	try {
		const subscription = await caller.premium.getCurrentSubscription();

		const hasSubscription = !!subscription;

		title = hasSubscription ? 'Manage Subscription' : 'Upgrade';
	} catch (error) {
		if (error instanceof TRPCError) title = error.message;
	}

	return {
		title,
	};
};

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
