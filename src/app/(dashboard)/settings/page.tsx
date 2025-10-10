import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import {
	AISettingsView,
	AISettingsViewError,
	AISettingsViewLoading,
} from '@/modules/settings/ui/views/ai-settings-view';

import { auth } from '@/lib/auth';
import { getQueryClient, trpc } from '@/trpc/server';

const AISettingsPage = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect('/sign-in');

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(trpc.settings.getAISettings.queryOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<AISettingsViewLoading />}>
				<ErrorBoundary FallbackComponent={AISettingsViewError}>
					<AISettingsView />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default AISettingsPage;
