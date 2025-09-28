import { botttsNeutral, initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface GeneratedAvatarProps {
	seed: string;
	className?: string;
	variant?: 'botttsNeutral' | 'initials';
}

export const GeneratedAvatar = ({ seed, className, variant = 'botttsNeutral' }: GeneratedAvatarProps) => {
	let avatar = createAvatar(botttsNeutral, { seed });

	if (variant === 'initials') {
		avatar = createAvatar(initials, {
			fontSize: 42,
			fontWeight: 500,
			seed,
		});
	}

	return (
		<Avatar className={cn(className)}>
			<AvatarImage src={avatar.toDataUri()} alt={`${seed}'s profile picture`} />
			<AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
		</Avatar>
	);
};
