/* eslint-disable sort-keys */

import { relations } from 'drizzle-orm';
import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

import { enumToPgEnum } from '@/lib/utils';

export const users = pgTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	image: text('image'),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	agents: many(agents),
	meetings: many(meetings),
	settings: one(userSettings, {
		fields: [users.id],
		references: [userSettings.userId],
	}),
}));

export const userSettings = pgTable('user_settings', {
	userId: text('user_id')
		.notNull()
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
	apiKey: text('api_key').notNull(),
});

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
	user: one(users, {
		fields: [userSettings.userId],
		references: [users.id],
	}),
}));

export const sessions = pgTable('session', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const accounts = pgTable('account', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const verifications = pgTable('verification', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const agents = pgTable(
	'agent',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => nanoid()),
		name: text('name').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		instructions: text('instruction').notNull(),

		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(agent) => [
		{
			nameIdx: index('name_idx').on(agent.name),
		},
	]
);

export const agentsRelations = relations(agents, ({ many, one }) => ({
	user: one(users, {
		fields: [agents.userId],
		references: [users.id],
	}),
	meetings: many(meetings),
}));

export enum MeetingStatus {
	UPCOMING = 'upcoming',
	ACTIVE = 'active',
	COMPLETED = 'completed',
	PROCESSING = 'processing',
	CANCELLED = 'cancelled',
}

export const meetings = pgTable(
	'meeting',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => nanoid()),
		name: text('name').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		agentId: text('agent_id')
			.notNull()
			.references(() => agents.id, { onDelete: 'cascade' }),
		status: text('status', { enum: enumToPgEnum(MeetingStatus) })
			.notNull()
			.default(MeetingStatus.UPCOMING),
		summary: text('summary'),

		transcriptUrl: text('transcript_url'),
		recordingUrl: text('recording_url'),

		startedAt: timestamp('started_at'),
		endedAt: timestamp('ended_at'),

		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(meeting) => [
		{
			nameIdx: index('name_idx').on(meeting.name),
		},
	]
);

export const meetingsRelations = relations(meetings, ({ one }) => ({
	agent: one(agents, {
		fields: [meetings.agentId],
		references: [agents.id],
	}),
	user: one(users, {
		fields: [meetings.userId],
		references: [users.id],
	}),
}));
