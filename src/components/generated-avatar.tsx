import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateAvatarUri } from '@/lib/avatar';
import { cn } from '@/lib/utils';

interface GeneratedAvatarProps {
	seed: string;
	className?: string;
	variant?: 'botttsNeutral' | 'initials';
}

export const GeneratedAvatar = ({ seed, className, variant = 'botttsNeutral' }: GeneratedAvatarProps) => {
	const avatarUri = generateAvatarUri({
		seed,
		variant,
	});

	return (
		<Avatar className={cn(className)}>
			<AvatarImage src={avatarUri} alt={`${seed}'s profile picture`} />
			<AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
		</Avatar>
	);
};
