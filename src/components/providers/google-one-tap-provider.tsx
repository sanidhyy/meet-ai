'use client';

import { useEffect } from 'react';

import { oneTap, useSession } from '@/lib/auth-client';

export const GoogleOneTapProvider = () => {
	const { data: session, isPending } = useSession();

	useEffect(() => {
		const handleOneTap = async () => {
			await oneTap({
				callbackURL: '/',
				cancelOnTapOutside: false,
				fetchOptions: {
					headers: {
						'Referrer-Policy': 'no-referrer-when-downgrade',
					},
				},
			});
		};

		if (!isPending && !session) handleOneTap();
	}, [isPending, session]);

	return null;
};
