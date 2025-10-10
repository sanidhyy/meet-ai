'use client';

import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import { AlertCircleIcon, HomeIcon, SparklesIcon } from 'lucide-react';

import { CallProvider } from '@/modules/call/ui/components/call-provider';

import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { MeetingStatus } from '@/db/schema';
import { useTRPC } from '@/trpc/client';

interface CallViewProps {
	meetingId: string;
}

export const CallView = ({ meetingId }: CallViewProps) => {
	const trpc = useTRPC();

	const { data: meeting } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));
	const { data: aiSettings } = useSuspenseQuery(trpc.settings.getAISettings.queryOptions());

	if (meeting.status === MeetingStatus.COMPLETED) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<ErrorState title='Meeting has ended' description='You can no longer join this meeting.' />
			</div>
		);
	}

	if (!aiSettings.apiKey.trim()) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<div className='flex flex-1 items-center justify-center px-8 py-4'>
					<div className='bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
						<AlertCircleIcon className='text-destructive size-6' />

						<div className='flex flex-col gap-y-2 text-center'>
							<h6 className='text-lg font-medium'>API Key is not set</h6>
							<p className='text-sm'>Please set an API key under settings to continue.</p>
						</div>

						<div className='flex flex-wrap items-center gap-2'>
							<Button size='sm' asChild>
								<Link href='/settings'>
									<SparklesIcon className='size-4' /> AI Settings
								</Link>
							</Button>

							<Button size='sm' variant='outline' asChild>
								<Link href='/'>
									<HomeIcon className='size-4' /> Home
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return <CallProvider meetingId={meetingId} meetingName={meeting.name} />;
};
