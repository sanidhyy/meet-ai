import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env.local' });

export default defineConfig({
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
	dialect: 'postgresql',
	out: './migrations',
	schema: './src/db/schema.ts',
	strict: true,
	verbose: true,
});
