import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import OpenAI, { OpenAIError } from 'openai';

import { AISettingsSchema } from '@/modules/settings/schema';

import { db } from '@/db';
import { userSettings } from '@/db/schema';
import { decrypt, encrypt } from '@/lib/encryption';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const settingsRouter = createTRPCRouter({
	getAISettings: protectedProcedure.query(async ({ ctx }) => {
		const {
			auth: { user },
		} = ctx;

		const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id));

		if (!settings) return { apiKey: '' };

		return {
			apiKey: decrypt(settings.apiKey),
		};
	}),
	removeAISettings: protectedProcedure.mutation(async ({ ctx }) => {
		const {
			auth: { user },
		} = ctx;

		const [settings] = await db.delete(userSettings).where(eq(userSettings.userId, user.id)).returning();

		if (!settings) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove AI Settings!' });

		return settings;
	}),
	saveAISettings: protectedProcedure.input(AISettingsSchema).mutation(async ({ ctx, input }) => {
		const {
			auth: { user },
		} = ctx;
		const { apiKey } = input;

		const openai = new OpenAI({
			apiKey,
		});

		try {
			await openai.models.list();
		} catch (error) {
			console.error(error);
			throw new TRPCError({
				cause: error instanceof Error ? error.cause : undefined,
				code: 'BAD_REQUEST',
				message:
					error instanceof OpenAIError
						? 'Invalid API Key!'
						: error instanceof Error
							? error.message
							: 'Failed to verify API key!',
			});
		}

		const encryptedApiKey = encrypt(apiKey);

		const [settings] = await db
			.insert(userSettings)
			.values({ apiKey: encryptedApiKey, userId: user.id })
			.onConflictDoUpdate({
				set: { apiKey: encryptedApiKey },
				target: [userSettings.userId],
			})
			.returning();

		if (!settings) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save AI Settings!' });

		return settings;
	}),
});
