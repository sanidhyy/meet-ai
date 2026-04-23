import { useCallback, useEffect, useMemo, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import type { Channel as StreamChannel } from 'stream-chat';
import { Channel, Chat, MessageComposer, MessageList, Thread, Window, useCreateChatClient } from 'stream-chat-react';

import { LoadingState } from '@/components/loading-state';
import { env } from '@/env/client';
import { useTRPC } from '@/trpc/client';

import 'stream-chat-react/dist/css/index.css';

interface ChatUIProps {
	meetingId: string;
	userId: string;
	userImage: string | undefined;
	userName: string;
}

export const ChatUI = ({ meetingId, userId, userImage, userName }: ChatUIProps) => {
	const trpc = useTRPC();

	const { mutateAsync: generateChatToken } = useMutation(trpc.meetings.generateChatToken.mutationOptions());

	const [channel, setChannel] = useState<StreamChannel>();

	const userData = useMemo(
		() => ({
			id: userId,
			image: userImage,
			name: userName,
		}),
		[userId, userImage, userName]
	);

	const tokenOrProvider = useCallback(() => generateChatToken(), [generateChatToken]);

	const client = useCreateChatClient({
		apiKey: env.NEXT_PUBLIC_STREAM_CHAT_API_KEY,
		tokenOrProvider,
		userData,
	});

	useEffect(() => {
		if (!client) return;

		let cancelled = false;
		let createdChannel: StreamChannel | undefined;

		(async () => {
			createdChannel = client.channel('messaging', meetingId, {
				members: [userId],
			});

			await createdChannel.watch();

			if (cancelled) return;
			setChannel(createdChannel);
		})().catch((err) => {
			console.error(err);
		});

		return () => {
			cancelled = true;
			setChannel(undefined);
			void createdChannel?.stopWatching();
		};
	}, [client, meetingId, userId]);

	useEffect(() => {
		if (!client) return;
		return () => {
			void client.disconnectUser();
		};
	}, [client]);

	if (!client || !channel) {
		return <LoadingState title='Loading...' description='Please wait while we load the chat.' />;
	}

	return (
		<div className='overflow-hidden rounded-lg border bg-white'>
			<Chat client={client}>
				<Channel channel={channel}>
					<Window>
						<div className='max-h-[calc(100vh-23rem)] flex-1 overflow-y-auto border-b'>
							<MessageList />
						</div>

						<MessageComposer />
					</Window>

					<Thread />
				</Channel>
			</Chat>
		</div>
	);
};
