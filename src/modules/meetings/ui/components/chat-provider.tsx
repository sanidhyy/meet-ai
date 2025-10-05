'use client';

import { LoadingState } from '@/components/loading-state';
import { useSession } from '@/lib/auth-client';

import { ChatUI } from './chat-ui';

interface ChatProviderProps {
	meetingId: string;
}

export const ChatProvider = ({ meetingId }: ChatProviderProps) => {
	const { data: session, isPending } = useSession();

	if (isPending || !session?.user) {
		return <LoadingState title='Loading...' description='Please wait while we load the chat.' />;
	}

	return (
		<ChatUI
			meetingId={meetingId}
			userId={session.user.id}
			userName={session.user.name}
			userImage={session.user.image || undefined}
		/>
	);
};
