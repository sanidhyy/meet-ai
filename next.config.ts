import type { NextConfig } from 'next';

import '@/env/client';
import '@/env/server';

const nextConfig: NextConfig = {
	devIndicators: false,
};

export default nextConfig;
