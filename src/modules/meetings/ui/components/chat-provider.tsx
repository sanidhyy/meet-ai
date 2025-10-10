'use client';

import Link from 'next/link';

import { AlertCircleIcon, SparklesIcon } from 'lucide-react';

import { LoadingState } from '@/components/loading-state';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';

import { ChatUI } from './chat-ui';

interface ChatProviderProps {
	apiKey: string;
	meetingId: string;
}

export const ChatProvider = ({ apiKey, meetingId }: ChatProviderProps) => {
	const { data: session, isPending } = useSession();

	if (isPending || !session?.user) {
		return <LoadingState title='Loading...' description='Please wait while we load the chat.' />;
	}

	if (!apiKey.trim()) {
		return (
			<div className='mt-8 flex items-center justify-center'>
				<div className='flex flex-1 items-center justify-center px-8 py-4'>
					<div className='bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
						<AlertCircleIcon className='text-destructive size-6' />

						<div className='flex flex-col gap-y-2 text-center'>
							<h6 className='text-lg font-medium'>API Key is not set</h6>
							<p className='text-sm'>Please set an API key under settings to continue.</p>
						</div>

						<Button size='sm' asChild>
							<Link href='/settings'>
								<SparklesIcon className='size-4' /> AI Settings
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<ChatUI
			meetingId={meetingId}
			userId={session.user.id}
			userName={session.user.name}
			userImage={session.user.image || undefined}
		/>
	);
};
