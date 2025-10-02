import 'server-only';

import { StreamClient } from '@stream-io/node-sdk';

import { env as clientEnv } from '@/env/client';
import { env } from '@/env/server';

export const streamVideo = new StreamClient(clientEnv.NEXT_PUBLIC_STREAM_VIDEO_API_KEY, env.STREAM_VIDEO_API_SECRET);
