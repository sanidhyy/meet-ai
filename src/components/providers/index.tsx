import type { PropsWithChildren } from 'react';

import { TRPCReactProvider } from '@/trpc/client';

import { GoogleOneTap } from './google-one-tap';

export const Providers = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<TRPCReactProvider>
			{children}

			<GoogleOneTap />
		</TRPCReactProvider>
	);
};
