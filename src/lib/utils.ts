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

export const formatPrice = (price: number, options?: Intl.NumberFormatOptions) => {
	return Intl.NumberFormat('en-US', {
		currency: 'USD',
		minimumFractionDigits: 0,
		style: 'currency',
		...options,
	}).format(price);
};

export const createChatInstructions = (summary: string, originalInstructions: string) => {
	const instructions = `
		You are an AI assistant helping the user revisit a recently completed meeting.
		Below is a summary of the meeting, generated from the transcript:
		
		${summary}
		
		The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
		
		${originalInstructions}
		
		The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
		Always base your responses on the meeting summary above.
		
		You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
		
		If the summary does not contain enough information to answer a question, politely let the user know.
		
		Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
	`;

	return instructions;
};
