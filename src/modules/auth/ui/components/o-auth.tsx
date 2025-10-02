'use client';

import type { Provider } from '@/modules/auth/types';

import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth-client';

interface OAuthProps {
	errorCallbackURL?: string;
	onBeforeOAuth?: (provider: Provider) => void;
	onError?: (error: string) => void;
	onSettled?: () => void;
	pending?: Provider | 'form' | null;
}

export const OAuth = ({
	errorCallbackURL = '/sign-in',
	onBeforeOAuth,
	onError,
	onSettled,
	pending = null,
}: OAuthProps) => {
	const handleOAuth = (provider: Provider) => {
		onBeforeOAuth?.(provider);

		signIn.social(
			{
				callbackURL: '/',
				errorCallbackURL,
				provider,
			},
			{
				onError: ({ error }) => {
					onError?.(error.message || `Failed to continue with ${provider}. Please try again!`);
				},
				onResponse: () => {
					onSettled?.();
				},
			}
		);
	};

	const isPending = pending !== null;

	return (
		<div className='space-y-3'>
			<div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
				<span className='bg-card text-muted-foreground relative z-10 px-2'>Or continue with</span>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<Button
					disabled={isPending}
					isLoading={pending === 'google'}
					variant='outline'
					type='button'
					onClick={() => handleOAuth('google')}
					className='w-full'
					aria-label='Continue with Google'
				>
					<img src='/google.svg' alt='Google' className='size-4' />
				</Button>

				<Button
					disabled={isPending}
					isLoading={pending === 'github'}
					variant='outline'
					type='button'
					onClick={() => handleOAuth('github')}
					className='w-full'
					aria-label='Continue with GitHub'
				>
					<img src='/github.svg' alt='GitHub' className='size-4' />
				</Button>
			</div>
		</div>
	);
};
