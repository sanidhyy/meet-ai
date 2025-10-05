import 'server-only';

import { StreamChat } from 'stream-chat';

import { env as clientEnv } from '@/env/client';
import { env } from '@/env/server';

export const streamChat = StreamChat.getInstance(clientEnv.NEXT_PUBLIC_STREAM_CHAT_API_KEY, env.STREAM_CHAT_API_SECRET);
