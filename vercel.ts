import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
	crons: [
		{
			path: '/api/cron/ai-settings',
			schedule: '0 0 * * *',
		},
	],
	ignoreCommand:
		"git diff HEAD^ HEAD --name-only | grep -qEv '(\.md$|LICENSE$|\.env\.example$|^\.github/|^\.vscode/)' && exit 1 || exit 0",
	trailingSlash: false,
};
