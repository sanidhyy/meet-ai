import type { inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '@/trpc/routers/_app';

export type MeetingGetMany = inferRouterOutputs<AppRouter>['meetings']['getMany'];
export type MeetingGetOne = inferRouterOutputs<AppRouter>['meetings']['getOne'];

export type StreamTranscriptItem = {
	speaker_id: string;
	type: string;
	text: string;
	start_ts: number;
	stop_ts: number;
};
