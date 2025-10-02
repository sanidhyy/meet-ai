'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, OctagonAlertIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH, MIN_NAME_LENGTH, MIN_PASSWORD_LENGTH } from '@/modules/auth/config';
import type { Provider } from '@/modules/auth/types';
import { OAuth } from '@/modules/auth/ui/components/o-auth';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUp } from '@/lib/auth-client';

const signUpFormSchema = z
	.object({
		confirmPassword: z.string().trim().min(1, 'Confirm Password is required!'),
		email: z.email('Invalid email!'),
		name: z
			.string()
			.trim()
			.min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters!`)
			.max(MAX_NAME_LENGTH, `Name cannot exceed ${MAX_NAME_LENGTH} characters!`),
		password: z
			.string()
			.min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters!`)
			.max(MAX_PASSWORD_LENGTH, `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters!`),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password did not match!',
				path: ['confirmPassword'],
			});
		}
	});

export const SignUpView = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [error, setError] = useState<string | null>(
		searchParams.get('error')?.trim() !== 'access_denied' ? searchParams.get('error_description')?.trim() || null : null
	);
	const [pending, setPending] = useState<Provider | 'form' | null>(null);

	const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
		defaultValues: {
			confirmPassword: '',
			email: '',
			name: '',
			password: '',
		},
		resolver: zodResolver(signUpFormSchema),
	});

	const handleSubmit = (values: z.infer<typeof signUpFormSchema>) => {
		setError(null);
		setPending('form');

		signUp.email(values, {
			onError: ({ error }) => {
				signUpForm.resetField('password');
				signUpForm.resetField('confirmPassword');
				setError(error.message || 'Failed to sign up. Please try again!');
			},
			onResponse: () => {
				setPending(null);
			},
			onSuccess: () => {
				signUpForm.reset();
				router.push('/');
			},
		});
	};

	const isPending = pending !== null;

	return (
		<Form {...signUpForm}>
			<form className='p-6 md:p-8' onSubmit={signUpForm.handleSubmit(handleSubmit)} autoCapitalize='off'>
				<div className='flex flex-col gap-6'>
					<div className='flex flex-col items-center text-center'>
						<h1 className='text-2xl font-bold'>Let&apos;s get started</h1>

						<p className='text-muted-foreground text-balance'>Create your account</p>
					</div>

					<div className='grid gap-3'>
						<FormField
							disabled={isPending}
							control={signUpForm.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>

									<FormControl>
										<Input type='text' placeholder='John Doe' autoFocus {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className='grid gap-3'>
						<FormField
							disabled={isPending}
							control={signUpForm.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>

									<FormControl>
										<Input type='email' placeholder='john.doe@example.com' {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className='grid gap-3'>
						<FormField
							disabled={isPending}
							control={signUpForm.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>

									<div className='relative'>
										<FormControl className='pr-12'>
											<Input
												type={passwordVisible ? 'text' : 'password'}
												placeholder={'•'.repeat(MIN_PASSWORD_LENGTH)}
												{...field}
											/>
										</FormControl>

										<button
											disabled={isPending}
											type='button'
											className='text-muted-foreground absolute inset-y-0 right-1 flex cursor-pointer items-center p-3 disabled:cursor-not-allowed disabled:opacity-50'
											onClick={() => {
												setPasswordVisible((prevPasswordVisible) => !prevPasswordVisible);
												signUpForm.setFocus('password');
											}}
										>
											{passwordVisible ? <EyeOffIcon className='size-5' /> : <EyeIcon className='size-5' />}
										</button>
									</div>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className='grid gap-3'>
						<FormField
							disabled={isPending}
							control={signUpForm.control}
							name='confirmPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>

									<FormControl>
										<Input type='password' placeholder='••••••••••' {...field} />
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
						Sign up
					</Button>

					<OAuth
						errorCallbackURL='/sign-up'
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
						Already have an account?{' '}
						<Link href='/sign-in' className='underline underline-offset-4'>
							Sign in
						</Link>
					</div>
				</div>
			</form>
		</Form>
	);
};
