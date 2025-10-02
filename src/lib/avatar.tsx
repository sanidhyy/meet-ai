import { botttsNeutral, initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

interface GenerateAvatarUriProps {
	seed: string;
	variant?: 'botttsNeutral' | 'initials';
}

export const generateAvatarUri = ({ seed, variant = 'botttsNeutral' }: GenerateAvatarUriProps) => {
	let avatar = createAvatar(botttsNeutral, { seed });

	if (variant === 'initials') {
		avatar = createAvatar(initials, { fontSize: 42, fontWeight: 500, seed });
	}

	return avatar.toDataUri();
};
