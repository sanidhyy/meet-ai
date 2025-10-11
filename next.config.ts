import type { NextConfig } from 'next';

import '@/env/client';
import '@/env/server';

const nextConfig: NextConfig = {
	devIndicators: false,
	redirects: async () => [
		{
			destination: '/meetings',
			permanent: true,
			source: '/',
		},
	],
};

export default nextConfig;
