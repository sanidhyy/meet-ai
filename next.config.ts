import type { NextConfig } from 'next';

import '@/env/client';
import '@/env/server';

const nextConfig: NextConfig = {
	images: { unoptimized: true },
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
