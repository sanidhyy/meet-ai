import type { PropsWithChildren } from 'react';

import { TRPCReactProvider } from '@/trpc/client';

import { GoogleOneTapProvider } from './google-one-tap-provider';
import { ToasterProvider } from './toaster-provider';

export const Providers = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<TRPCReactProvider>
			{children}

			<ToasterProvider />
			<GoogleOneTapProvider />
		</TRPCReactProvider>
	);
};
