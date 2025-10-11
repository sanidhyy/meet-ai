'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, FileQuestion, Home } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NotFoundPage = () => {
	const router = useRouter();

	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4'>
			<div className='max-w-xl space-y-6 text-center'>
				<FileQuestion className='text-primary mx-auto size-20' strokeWidth={2.5} />

				<h1 className='text-4xl font-bold text-gray-900'>404 - Page Not Found</h1>
				<p className='text-lg text-gray-600'>
					Oops! It looks like the page you&apos;re looking for doesn&apos;t exist. Maybe it was moved or renamed?
				</p>

				<div className='flex items-center justify-center space-x-4'>
					<Button variant='outline' onClick={() => router.back()}>
						<ArrowLeft className='size-4' />
						Go Back
					</Button>

					<Link href='/' className={cn(buttonVariants())}>
						<Home className='size-4' />
						Return to Home
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
