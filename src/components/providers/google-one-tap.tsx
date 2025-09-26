'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { oneTap, useSession } from '@/lib/auth-client';

export const GoogleOneTap = () => {
	const router = useRouter();
	const { data: session, isPending } = useSession();

	useEffect(() => {
		const handleOneTap = async () => {
			await oneTap({
				fetchOptions: {
					headers: {
						'Referrer-Policy': 'no-referrer-when-downgrade',
					},
					onSuccess: () => {
						router.push('/');
					},
				},
			});
		};

		if (!isPending && !session) handleOneTap();
	}, [isPending, router, session]);

	return null;
};
