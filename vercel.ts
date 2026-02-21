import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
	crons: [
		{
			path: '/api/cron/ai-settings',
			schedule: '0 0 * * *',
		},
	],
	ignoreCommand: "git diff HEAD^ HEAD --quiet . ':!*.md' ':!LICENSE' ':!.env.example' ':!.github' ':!.vscode'",
	trailingSlash: false,
};
