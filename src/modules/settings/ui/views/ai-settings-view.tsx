'use client';

import { AISettingsForm } from '@/modules/settings/ui/components/ai-settings-form';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ErrorFallbackProps } from '@/types';

export const AISettingsViewLoading = () => {
	return <LoadingState title='Loading Settings' description='This may take a few seconds.' />;
};

export const AISettingsViewError = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
	return (
		<ErrorState
			title='Failed to load Settings'
			description={error?.message || 'Something went wrong.'}
			onRetry={resetErrorBoundary}
		/>
	);
};

export const AISettingsView = () => {
	return (
		<div className='flex size-full flex-col items-center justify-center p-2'>
			<Card className='w-full max-w-lg'>
				<CardHeader>
					<CardTitle>AI Settings</CardTitle>
					<CardDescription>
						Unlock the power of AI for your meetings - from intelligent chat assistance to automated transcripts,
						summaries, and beyond.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<AISettingsForm />
				</CardContent>
			</Card>
		</div>
	);
};
