import type { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '@/components/providers';
import { SITE_CONFIG } from '@/config';
import { cn } from '@/lib/utils';

import './globals.css';

const inter = Inter({
	subsets: ['latin'],
});

export const metadata: Metadata = SITE_CONFIG;

export const viewport: Viewport = {
	themeColor: '#16A34A',
};

const RootLayout = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<html lang='en'>
			<body className={cn(inter.className, 'antialiased')}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
