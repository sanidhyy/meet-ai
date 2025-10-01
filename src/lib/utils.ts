import { clsx, type ClassValue } from 'clsx';
import humanizeDuration from 'humanize-duration';
import { twMerge } from 'tailwind-merge';

import { env } from '@/env/client';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const absoluteUrl = (path: string): string => {
	const formattedPath = path.trim();
	if (formattedPath.startsWith('http')) return formattedPath;

	let baseUrl = env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';

	// Note: Don't use env from @/server/env here.
	const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
	const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

	if (!!vercelEnv && vercelEnv === 'preview' && !!vercelUrl) baseUrl = `https://${vercelUrl}`;

	return `${baseUrl}${formattedPath.startsWith('/') ? '' : '/'}${formattedPath}`;
};

export const enumToPgEnum = <T extends Record<string, unknown>>(myEnum: T): [T[keyof T], ...T[keyof T][]] => {
	return Object.values(myEnum).map((value: unknown) => `${value}`) as never;
};

export const formatDuration = (seconds: number) => {
	return humanizeDuration(seconds * 1000, {
		largest: 1,
		round: true,
		units: ['h', 'm', 's'],
	});
};
