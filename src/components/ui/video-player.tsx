'use client';

import type { CSSProperties, ComponentProps } from 'react';

import {
	MediaControlBar,
	MediaController,
	MediaFullscreenButton,
	MediaMuteButton,
	MediaPlayButton,
	MediaSeekBackwardButton,
	MediaSeekForwardButton,
	MediaTimeDisplay,
	MediaTimeRange,
	MediaVolumeRange,
} from 'media-chrome/react';

import { cn } from '@/lib/utils';

export type VideoPlayerProps = ComponentProps<typeof MediaController>;

const variables = {
	'--media-background-color': 'var(--background)',
	'--media-control-hover-background': 'var(--accent)',
	'--media-font-family': 'var(--font-sans)',
	'--media-live-button-icon-color': 'var(--muted-foreground)',
	'--media-live-button-indicator-color': 'var(--destructive)',
	'--media-primary-color': 'var(--primary)',
	'--media-range-track-background': 'var(--border)',
	'--media-secondary-color': 'var(--background)',
	'--media-text-color': 'var(--foreground)',
} as CSSProperties;

export const VideoPlayer = ({ style, ...props }: VideoPlayerProps) => (
	<MediaController
		style={{
			...variables,
			...style,
		}}
		{...props}
	/>
);

export type VideoPlayerControlBarProps = ComponentProps<typeof MediaControlBar>;

export const VideoPlayerControlBar = (props: VideoPlayerControlBarProps) => <MediaControlBar {...props} />;

export type VideoPlayerTimeRangeProps = ComponentProps<typeof MediaTimeRange>;

export const VideoPlayerTimeRange = ({ className, ...props }: VideoPlayerTimeRangeProps) => (
	<MediaTimeRange className={cn('p-2.5', className)} {...props} />
);

export type VideoPlayerTimeDisplayProps = ComponentProps<typeof MediaTimeDisplay>;

export const VideoPlayerTimeDisplay = ({ className, ...props }: VideoPlayerTimeDisplayProps) => (
	<MediaTimeDisplay className={cn('p-2.5', className)} {...props} />
);

export type VideoPlayerVolumeRangeProps = ComponentProps<typeof MediaVolumeRange>;

export const VideoPlayerVolumeRange = ({ className, ...props }: VideoPlayerVolumeRangeProps) => (
	<MediaVolumeRange className={cn('p-2.5', className)} {...props} />
);

export type VideoPlayerPlayButtonProps = ComponentProps<typeof MediaPlayButton>;

export const VideoPlayerPlayButton = ({ className, ...props }: VideoPlayerPlayButtonProps) => (
	<MediaPlayButton className={cn('p-2.5', className)} {...props} />
);

export type VideoPlayerSeekBackwardButtonProps = ComponentProps<typeof MediaSeekBackwardButton>;

export const VideoPlayerSeekBackwardButton = ({ className, ...props }: VideoPlayerSeekBackwardButtonProps) => (
	<MediaSeekBackwardButton className={cn('p-2.5', className)} {...props} />
);

export type VideoPlayerSeekForwardButtonProps = ComponentProps<typeof MediaSeekForwardButton>;

export const VideoPlayerSeekForwardButton = ({ className, ...props }: VideoPlayerSeekForwardButtonProps) => (
	<MediaSeekForwardButton className={cn('p-2.5', className)} {...props} />
);

export type VideoPlayerMuteButtonProps = ComponentProps<typeof MediaMuteButton>;

export const VideoPlayerMuteButton = ({ className, ...props }: VideoPlayerMuteButtonProps) => (
	<MediaMuteButton className={cn('p-2.5', className)} {...props} />
);

export type VideoPlayerContentProps = ComponentProps<'video'>;

export const VideoPlayerContent = ({ className, ...props }: VideoPlayerContentProps) => (
	<video className={cn('mt-0 mb-0', className)} {...props} />
);

export type VideoPlayerFullscreenButtonProps = ComponentProps<typeof MediaFullscreenButton>;

export const VideoPlayerFullscreenButton = ({ className, ...props }: VideoPlayerFullscreenButtonProps) => (
	<MediaFullscreenButton className={cn('p-2.5', className)} {...props} />
);
