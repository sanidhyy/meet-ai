'use client';

import Link from 'next/link';

import { AlertCircleIcon, HomeIcon, RotateCcwIcon } from 'lucide-react';

import { Button } from './ui/button';

interface ErrorStateProps {
	description: string;
	title: string;
	onRetry?: () => void;
}

export const ErrorState = ({ description, title, onRetry }: ErrorStateProps) => {
	return (
		<div className='flex flex-1 items-center justify-center px-8 py-4'>
			<div className='bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
				<AlertCircleIcon className='text-destructive size-6' />

				<div className='flex flex-col gap-y-2 text-center'>
					<h6 className='text-lg font-medium'>{title}</h6>
					<p className='text-sm'>{description}</p>
				</div>

				<div className='flex flex-wrap items-center gap-2'>
					{!!onRetry && (
						<Button size='sm' onClick={onRetry}>
							<RotateCcwIcon className='size-4' /> Retry
						</Button>
					)}
					<Button size='sm' variant='outline' asChild>
						<Link href='/'>
							<HomeIcon className='size-4' /> Home
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};
