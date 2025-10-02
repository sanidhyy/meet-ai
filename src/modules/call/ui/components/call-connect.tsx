import { useEffect, useState } from 'react';

import { CallingState, StreamCall, StreamVideo, StreamVideoClient, type Call } from '@stream-io/video-react-sdk';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';

import { useTRPC } from '@/trpc/client';

import '@stream-io/video-react-sdk/dist/css/styles.css';

import { env } from '@/env/client';

import { CallUI } from './call-ui';

interface CallConnectProps {
	meetingId: string;
	meetingName: string;
	userId: string;
	userImage: string;
	userName: string;
}

export const CallConnect = ({ meetingId, meetingName, userId, userImage, userName }: CallConnectProps) => {
	const trpc = useTRPC();
	const { mutateAsync: generateToken } = useMutation(trpc.meetings.generateToken.mutationOptions());

	const [client, setClient] = useState<StreamVideoClient>();
	const [call, setCall] = useState<Call>();

	useEffect(() => {
		const streamVideoClient = new StreamVideoClient({
			apiKey: env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY,
			tokenProvider: generateToken,
			user: {
				id: userId,
				image: userImage,
				name: userName,
			},
		});

		setClient(streamVideoClient);

		return () => {
			streamVideoClient.disconnectUser();
			setClient(undefined);
		};
	}, [userId, userName, userImage, generateToken]);

	useEffect(() => {
		if (!client) return;

		const streamVideoCall = client.call('default', meetingId);
		streamVideoCall.camera.disable();
		streamVideoCall.microphone.disable();

		setCall(streamVideoCall);

		return () => {
			if (streamVideoCall.state.callingState !== CallingState.LEFT) {
				streamVideoCall.leave();
				streamVideoCall.endCall();

				setCall(undefined);
			}
		};
	}, [client, meetingId]);

	if (!client || !call) {
		return (
			<div className='from-sidebar-accent to-sidebar flex h-screen items-center justify-center bg-radial'>
				<Loader2Icon className='size-6 animate-spin text-white' strokeWidth={2.5} aria-label='Loading...' />
			</div>
		);
	}

	return (
		<StreamVideo client={client}>
			<StreamCall call={call}>
				<CallUI meetingName={meetingName} />
			</StreamCall>
		</StreamVideo>
	);
};
