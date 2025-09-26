'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { OctagonAlertIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { MIN_PASSWORD_LENGTH } from '@/modules/auth/config';
import { Provider } from '@/modules/auth/types';
import { OAuth } from '@/modules/auth/ui/components/o-auth';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';

const signInFormSchema = z.object({
	email: z.email('Invalid email!'),
	password: z.string().trim().min(1, 'Password is required!'),
});

export const SignInView = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | null>(
		searchParams.get('error')?.trim() !== 'access_denied' ? searchParams.get('error_description')?.trim() || null : null
	);
	const [pending, setPending] = useState<Provider | 'form' | null>(null);

	const signInForm = useForm<z.infer<typeof signInFormSchema>>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(signInFormSchema),
	});

	const handleSubmit = (values: z.infer<typeof signInFormSchema>) => {
		setError(null);
		setPending('form');

		signIn.email(values, {
			onError: ({ error }) => {
				signInForm.resetField('password');
				setError(error.message || 'Failed to sign in. Please try again!');
			},
			onResponse: () => {
				setPending(null);
			},
			onSuccess: () => {
				signInForm.reset();
				router.push('/');
			},
		});
	};

	const isPending = pending !== null;

	return (
		<Form {...signInForm}>
			<form className='p-6 md:p-8' onSubmit={signInForm.handleSubmit(handleSubmit)} autoCapitalize='off'>
				<div className='flex flex-col gap-6'>
					<div className='flex flex-col items-center text-center'>
						<h1 className='text-2xl font-bold'>Welcome back</h1>

						<p className='text-muted-foreground text-balance'>Login to your account</p>
					</div>

					<div className='grid gap-3'>
						<FormField
							disabled={isPending}
							control={signInForm.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>

									<FormControl>
										<Input type='email' placeholder='john.doe@example.com' autoFocus {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className='grid gap-3'>
						<FormField
							disabled={isPending}
							control={signInForm.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>

									<FormControl>
										<Input type='password' placeholder={'•'.repeat(MIN_PASSWORD_LENGTH)} {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{!!error && (
						<Alert className='bg-destructive/10 border-none'>
							<OctagonAlertIcon className='!text-destructive size-4' />
							<AlertTitle>{error}!</AlertTitle>
						</Alert>
					)}

					<Button disabled={isPending} isLoading={pending === 'form'} type='submit' className='w-full'>
						Sign in
					</Button>

					<OAuth
						onBeforeOAuth={(provider) => {
							setError(null);
							setPending(provider);
						}}
						onError={(error) => {
							setError(error);
						}}
						onSettled={() => setPending(null)}
						pending={pending}
					/>

					<div className='text-center text-sm'>
						Don&apos;t have an account?{' '}
						<Link href='/sign-up' className='underline underline-offset-4'>
							Sign up
						</Link>
					</div>
				</div>
			</form>
		</Form>
	);
};
