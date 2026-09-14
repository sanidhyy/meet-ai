import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';

import { AISettingsSchema } from '@/modules/settings/schema';

import { db } from '@/db';
import { userSettings } from '@/db/schema';
import { decrypt, encrypt } from '@/lib/encryption';
import { getAISettingsErrorMessage } from '@/lib/utils';
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
			const completion = await openai.chat.completions.create({
				max_completion_tokens: 5, // eslint-disable-line camelcase -- OpenAI API parameter
				messages: [{ content: 'hi', role: 'user' }],
				model: 'gpt-4o-mini',
			});

			if (!completion.choices[0]?.message?.content) throw new Error('No response from API');
		} catch (error) {
			console.error(error);
			throw new TRPCError({ code: 'BAD_REQUEST', message: getAISettingsErrorMessage(error) });
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
