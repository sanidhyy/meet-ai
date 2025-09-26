import type { PropsWithChildren } from 'react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';

const AuthLayout = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
			<div className='w-full max-w-sm md:max-w-3xl'>
				<div className='flex flex-col gap-6'>
					<Card className='overflow-hidden p-0'>
						<CardContent className='grid p-0 md:grid-cols-2'>
							{children}

							<div className='relative hidden flex-col items-center justify-center gap-y-4 bg-radial from-green-700 to-green-900 md:flex'>
								<img src='/logo.svg' alt='Image' className='size-[92px]' />

								<p className='text-2xl font-semibold text-white'>Meet.AI</p>
							</div>
						</CardContent>
					</Card>

					<div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
						By clicking continue, you agree to our <Link href='#'>Terms of Service</Link> and{' '}
						<Link href='#'>Privacy Policy</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default AuthLayout;
