import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { absoluteUrl } from '@/lib/utils';

export const GET = async (req: NextRequest) => {
	const session = await auth.api.getSession({
		headers: req.headers,
	});

	if (!session) return NextResponse.redirect(absoluteUrl('/sign-in'));

	const { url } = await auth.api.portal({
		headers: req.headers,
	});

	return NextResponse.redirect(url);
};
