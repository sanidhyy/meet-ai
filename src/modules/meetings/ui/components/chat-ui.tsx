import { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import type { Channel as StreamChannel } from 'stream-chat';
import {
	Channel,
	Chat,
	MessageInput,
	MessageList,
	Thread,
	Window,
	useCreateChatClient,
	useStateStore,
} from 'stream-chat-react';

import { LoadingState } from '@/components/loading-state';
import { env } from '@/env/client';
import { useTRPC } from '@/trpc/client';

import 'stream-chat-react/dist/css/v2/index.css';

interface ChatUIProps {
	meetingId: string;
	meetingName: string;
	userId: string;
	userImage: string | undefined;
	userName: string;
}

export const ChatUI = ({ meetingId, meetingName, userId, userImage, userName }: ChatUIProps) => {
	const trpc = useTRPC();

	const { mutateAsync: generateChatToken } = useMutation(trpc.meetings.generateChatToken.mutationOptions());

	const [channel, setChannel] = useState<StreamChannel>();

	const client = useCreateChatClient({
		apiKey: env.NEXT_PUBLIC_STREAM_CHAT_API_KEY,
		tokenOrProvider: generateChatToken,
		userData: {
			id: userId,
			image: userImage,
			name: userName,
		},
	});

	useEffect(() => {
		if (!client) return;

		const channel = client.channel('messaging', meetingId, {
			members: [userId],
		});

		setChannel(channel);
	}, [client, meetingId, userId]);

	if (!client) {
		return <LoadingState title='Loading...' description='Please wait while we load the chat.' />;
	}

	return (
		<div className='overflow-hidden rounded-lg border bg-white'>
			<Chat client={client}>
				<Channel channel={channel}>
					<Window>
						<div className='max-h-[calc(100vh_-_23rem)] flex-1 overflow-y-auto border-b'>
							<MessageList />
						</div>

						<MessageInput />
					</Window>

					<Thread />
				</Channel>
			</Chat>
		</div>
	);
};
