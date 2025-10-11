import Link from 'next/link';

import {
	DefaultVideoPlaceholder,
	ToggleAudioPreviewButton,
	ToggleVideoPreviewButton,
	VideoPreview,
	useCallStateHooks,
	type StreamVideoParticipant,
} from '@stream-io/video-react-sdk';
import { LogInIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';

import '@stream-io/video-react-sdk/dist/css/styles.css';

interface CallLobbyProps {
	onJoin: () => void;
}

const DisabledVideoPreview = () => {
	const { data: session } = useSession();

	const userName = session?.user.name || '';
	const userImage = session?.user.image || generateAvatarUri({ seed: userName, variant: 'initials' });

	return (
		<DefaultVideoPlaceholder
			participant={
				{
					image: userImage,
					name: userName,
				} as StreamVideoParticipant
			}
		/>
	);
};

const AllowBrowserPermissions = () => {
	return (
		<p className='px-4 text-center text-xs sm:text-sm'>
			Please grant your browser permission to access your camera and microphone.
		</p>
	);
};

export const CallLobby = ({ onJoin }: CallLobbyProps) => {
	const { useCameraState, useMicrophoneState } = useCallStateHooks();

	const { hasBrowserPermission: hasCameraPermission } = useCameraState();
	const { hasBrowserPermission: hasMicrophonePermission } = useMicrophoneState();

	const hasBrowserMediaPermission = hasCameraPermission && hasMicrophonePermission;

	return (
		<div className='from-sidebar-accent to-sidebar flex h-full flex-col items-center justify-center bg-radial'>
			<div className='flex flex-1 items-center justify-center px-3 py-4 sm:px-8'>
				<div className='bg-background flex w-full max-w-md flex-col items-center justify-center gap-y-3 rounded-lg p-4 shadow-sm sm:gap-y-6 sm:p-10'>
					<div className='flex flex-col gap-y-1 text-center sm:gap-y-2'>
						<h6 className='text-base font-medium sm:text-lg'>Ready to join</h6>
						<p className='text-xs sm:text-sm'>Set up your call before joining</p>
					</div>

					<div className='w-full'>
						<VideoPreview
							DisabledVideoPreview={hasBrowserMediaPermission ? DisabledVideoPreview : AllowBrowserPermissions}
							className='max-w-xs sm:max-w-sm'
						/>
					</div>

					<div className='flex gap-x-2'>
						<ToggleAudioPreviewButton />
						<ToggleVideoPreviewButton />
					</div>

					<div className='flex w-full flex-col gap-y-2 sm:flex-row sm:justify-between sm:gap-x-2 sm:gap-y-0'>
						<Button variant='ghost' asChild className='w-full sm:w-auto'>
							<Link href='/meetings'>Cancel</Link>
						</Button>
						<Button onClick={onJoin} className='w-full sm:w-auto'>
							<LogInIcon className='h-4 w-4' />
							<span className='ml-2'>Join Call</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
