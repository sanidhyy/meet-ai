import type { Metadata } from 'next';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const MIN_PAGE_SIZE = 1;

export const SUMMARIZER_AGENT_PROMPT = `
  You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

  Use the following markdown structure for every output:

  ### Overview
  Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

  ### Notes
  Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

  Example:
  #### Section Name
  - Main point or demo shown here
  - Another key insight or interaction
  - Follow-up tool or explanation provided

  #### Next Section
  - Feature X automatically does Y
  - Mention of integration with Z
`;

export const SITE_CONFIG: Metadata = {
	appleWebApp: {
		title: 'Meet.AI',
	},
	authors: {
		name: 'Sanidhya Kumar Verma',
		url: 'https://github.com/sanidhyy',
	},
	description: 'AI-Powered Intelligent Chat Assistant and Meeting Summarizer using Next.js 15 and Stream Video.',
	keywords: [
		'reactjs',
		'nextjs',
		'stream-video',
		'stream-chat',
		'stream-video-react-sdk',
		'stream-chat-react-sdk',
		'stream-video-react',
		'stream-chat-react',
		'better-auth',
		'lucide-icons',
		'getstream-io',
		'player.js',
		'shadcn-ui',
		'radix-ui',
		'dicebear',
		'polar-sh',
		'nuqs',
		'tailwindcss',
		'uploadthing',
		'react-query',
		'openai',
		'trpc',
		'drizzle-orm',
		'zod',
		'react-hot-toast',
		'typescript',
		'javascript',
		'vercel',
		'postcss',
		'prettier',
		'eslint',
		'react',
		'react-dom',
		'html',
		'css',
		'date-fns',
		'cn',
		'clsx',
		'lucide-react',
		'neon-db',
	] as Array<string>,
	title: {
		default: 'Meet.AI',
		template: '%s | Meet.AI',
	},
} as const;

export const LINKS = {
	SOURCE_CODE: 'https://github.com/sanidhyy/meet-ai',
} as const;
