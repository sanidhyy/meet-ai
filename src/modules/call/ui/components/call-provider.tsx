'use client';

import { Loader2Icon } from 'lucide-react';

import { useSession } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';

import { CallConnect } from './call-connect';

interface CallProviderProps {
	meetingId: string;
	meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: CallProviderProps) => {
	const { data: session, isPending } = useSession();

	if (!session || isPending) {
		return (
			<div className='from-sidebar-accent to-sidebar flex h-screen items-center justify-center bg-radial'>
				<Loader2Icon className='size-6 animate-spin text-white' strokeWidth={2.5} />
			</div>
		);
	}

	return (
		<CallConnect
			meetingId={meetingId}
			meetingName={meetingName}
			userId={session.user.id}
			userImage={session.user.image || generateAvatarUri({ seed: session.user.name, variant: 'initials' })}
			userName={session.user.name}
		/>
	);
};
