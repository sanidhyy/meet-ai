import Link from 'next/link';

import { formatDate } from 'date-fns';
import { BookOpenTextIcon, ClockFadingIcon, FileTextIcon, FileVideoIcon, SparklesIcon } from 'lucide-react';
import Markdown from 'react-markdown';

import type { MeetingGetOne } from '@/modules/meetings/types';

import { GeneratedAvatar } from '@/components/generated-avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	VideoPlayer,
	VideoPlayerContent,
	VideoPlayerControlBar,
	VideoPlayerFullscreenButton,
	VideoPlayerMuteButton,
	VideoPlayerPlayButton,
	VideoPlayerSeekBackwardButton,
	VideoPlayerSeekForwardButton,
	VideoPlayerTimeDisplay,
	VideoPlayerTimeRange,
	VideoPlayerVolumeRange,
} from '@/components/ui/video-player';
import { cn, formatDuration } from '@/lib/utils';

import { ChatProvider } from './chat-provider';
import { Transcript } from './transcript';

interface CompletedStateProps {
	data: MeetingGetOne;
}

export const CompletedState = ({ data }: CompletedStateProps) => {
	return (
		<div className='flex flex-col gap-y-4'>
			<Tabs defaultValue='summary'>
				<div className='rounded-lg border bg-white px-3'>
					<ScrollArea>
						<TabsList className='bg-background h-13 rotate-none justify-start p-0'>
							<TabsTrigger
								value='summary'
								className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
							>
								<BookOpenTextIcon />
								Summary
							</TabsTrigger>

							<TabsTrigger
								value='transcript'
								className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
							>
								<FileTextIcon />
								Transcript
							</TabsTrigger>

							<TabsTrigger
								value='recording'
								className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
							>
								<FileVideoIcon />
								Recording
							</TabsTrigger>

							<TabsTrigger
								value='chat'
								className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
							>
								<SparklesIcon />
								Ask AI
							</TabsTrigger>
						</TabsList>

						<ScrollBar orientation='horizontal' />
					</ScrollArea>
				</div>

				<TabsContent value='recording'>
					<div className='rounded-lg bg-white px-4 py-5'>
						<VideoPlayer className='size-full overflow-hidden rounded-lg border'>
							<VideoPlayerContent
								src={data.recordingUrl!}
								crossOrigin=''
								preload='auto'
								slot='media'
								className='border-none'
							/>

							<VideoPlayerControlBar>
								<VideoPlayerPlayButton />
								<VideoPlayerSeekBackwardButton />
								<VideoPlayerSeekForwardButton />
								<VideoPlayerTimeRange />
								<VideoPlayerTimeDisplay showDuration />
								<VideoPlayerMuteButton />
								<VideoPlayerVolumeRange />
								<VideoPlayerFullscreenButton />
							</VideoPlayerControlBar>
						</VideoPlayer>
					</div>
				</TabsContent>

				<TabsContent value='summary'>
					<div className='rounded-lg border bg-white'>
						<div className='col-span-5 flex flex-col gap-y-5 px-4 py-5'>
							<h2 className='text-2xl font-medium capitalize'>{data.name}</h2>

							<div className='flex items-center gap-x-2'>
								<Link
									href={`/agents/${data.agentId}`}
									className='flex items-center gap-x-2 capitalize underline underline-offset-4'
								>
									<GeneratedAvatar variant='botttsNeutral' seed={data.agent.name} className='size-5' />

									{data.agent.name}
								</Link>{' '}
								<p>{data.startedAt ? formatDate(data.startedAt, 'PPP') : ''}</p>
							</div>

							<div className='flex items-center gap-x-2'>
								<SparklesIcon className='size-4' />
								<p>General summary</p>
							</div>

							<Badge variant='outline' className='flex items-center gap-x-2 [&_svg]:size-4'>
								<ClockFadingIcon className='text-blue-700' />
								{data.duration ? formatDuration(data.duration) : 'No duration'}
							</Badge>

							<div>
								<Markdown
									components={{
										blockquote: ({ className, ...props }) => (
											<blockquote className={cn('my-4 border-l-4 pl-4 italic', className)} {...props} />
										),
										code: ({ className, ...props }) => (
											<code className={cn('rounded bg-gray-100 px-1 py-0.5', className)} {...props} />
										),
										h1: ({ className, ...props }) => (
											<h1 className={cn('mb-6 text-2xl font-medium', className)} {...props} />
										),
										h2: ({ className, ...props }) => (
											<h2 className={cn('mb-6 text-xl font-medium', className)} {...props} />
										),
										h3: ({ className, ...props }) => (
											<h3 className={cn('mb-6 text-lg font-medium', className)} {...props} />
										),
										h4: ({ className, ...props }) => (
											<h4 className={cn('mb-6 text-base font-medium', className)} {...props} />
										),
										li: ({ className, ...props }) => <li className={cn('mb-1', className)} {...props} />,
										ol: ({ className, ...props }) => (
											<ol className={cn('mb-6 list-inside list-decimal', className)} {...props} />
										),
										p: ({ className, ...props }) => <p className={cn('mb-6 leading-relaxed', className)} {...props} />,
										strong: ({ className, ...props }) => (
											<strong className={cn('font-semibold', className)} {...props} />
										),
										ul: ({ className, ...props }) => (
											<ul className={cn('mb-6 list-inside list-disc', className)} {...props} />
										),
									}}
								>
									{data.summary}
								</Markdown>
							</div>
						</div>
					</div>
				</TabsContent>

				<TabsContent value='transcript'>
					<Transcript meetingId={data.id} />
				</TabsContent>

				<TabsContent value='chat'>
					<ChatProvider meetingId={data.id} />
				</TabsContent>
			</Tabs>
		</div>
	);
};
