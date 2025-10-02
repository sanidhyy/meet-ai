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
	return <p className='text-sm'>Please grant your browser permission to access your camera and microphone.</p>;
};

export const CallLobby = ({ onJoin }: CallLobbyProps) => {
	const { useCameraState, useMicrophoneState } = useCallStateHooks();

	const { hasBrowserPermission: hasCameraPermission } = useCameraState();
	const { hasBrowserPermission: hasMicrophonePermission } = useMicrophoneState();

	const hasBrowserMediaPermission = hasCameraPermission && hasMicrophonePermission;

	return (
		<div className='from-sidebar-accent to-sidebar flex h-full flex-col items-center justify-center bg-radial'>
			<div className='flex flex-1 items-center justify-center px-8 py-4'>
				<div className='bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
					<div className='flex flex-col gap-y-2 text-center'>
						<h6 className='text-lg font-medium'>Ready to join</h6>
						<p className='text-sm'>Set up your call before joining</p>
					</div>

					<VideoPreview
						DisabledVideoPreview={hasBrowserMediaPermission ? DisabledVideoPreview : AllowBrowserPermissions}
					/>

					<div className='flex gap-x-2'>
						<ToggleAudioPreviewButton />
						<ToggleVideoPreviewButton />
					</div>

					<div className='flex w-full justify-between gap-x-2'>
						<Button variant='ghost' asChild>
							<Link href='/meetings'>Cancel</Link>
						</Button>
						<Button onClick={onJoin}>
							<LogInIcon /> Join Call
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
