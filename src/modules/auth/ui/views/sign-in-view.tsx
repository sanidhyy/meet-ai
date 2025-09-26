'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { OctagonAlertIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';

const signInFormSchema = z.object({
	email: z.email('Invalid email!'),
	password: z.string().trim().min(1, 'Password is required!'),
});

export const SignInView = () => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);

	const signInForm = useForm<z.infer<typeof signInFormSchema>>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(signInFormSchema),
	});

	const handleSubmit = (values: z.infer<typeof signInFormSchema>) => {
		setError(null);
		setIsPending(true);

		signIn.email(values, {
			onError: ({ error }) => {
				setError(error.message || 'Failed to sign in. Please try again!');
			},
			onResponse: () => {
				setIsPending(false);
			},
			onSuccess: () => {
				signInForm.reset();
				router.push('/');
			},
		});
	};

	return (
		<div className='flex flex-col gap-6'>
			<Card className='overflow-hidden p-0'>
				<CardContent className='grid p-0 md:grid-cols-2'>
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
													<Input type='password' placeholder='••••••••••' autoFocus {...field} />
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

								<Button isLoading={isPending} type='submit' className='w-full'>
									Sign in
								</Button>

								<div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
									<span className='bg-card text-muted-foreground relative z-10 px-2'>Or continue with</span>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<Button disabled={isPending} variant='outline' type='button' className='w-full'>
										Google
									</Button>

									<Button disabled={isPending} variant='outline' type='button' className='w-full'>
										GitHub
									</Button>
								</div>

								<div className='text-center text-sm'>
									Don&apos;t have an account?{' '}
									<Link href='/sign-up' className='underline underline-offset-4'>
										Sign up
									</Link>
								</div>
							</div>
						</form>
					</Form>

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
	);
};
