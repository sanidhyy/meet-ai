import { NextResponse, type NextRequest } from 'next/server';

import { lte } from 'drizzle-orm';

import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from '@/config/http-status-codes';
import { db } from '@/db';
import { userSettings } from '@/db/schema';
import { env } from '@/env/server';

export async function GET(req: NextRequest) {
	try {
		const authHeader = req.headers.get('authorization');
		if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
			return NextResponse.json(
				{ error: 'Unauthorized!' },
				{
					status: UNAUTHORIZED,
				}
			);
		}

		const now = new Date();
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		await db.delete(userSettings).where(lte(userSettings.updatedAt, thirtyDaysAgo));

		return NextResponse.json({ status: OK });
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Failed to delete AI Settings!' },
			{
				status: INTERNAL_SERVER_ERROR,
			}
		);
	}
}
