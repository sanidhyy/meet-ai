import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from 'lucide-react';

import { GeneratedAvatar } from '@/components/generated-avatar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { customer, signOut, useSession } from '@/lib/auth-client';

export const DashboardUserButton = () => {
	const router = useRouter();
	const { data: session, isPending } = useSession();
	const isMobile = useIsMobile();

	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = () => {
		setIsLoggingOut(true);

		signOut({
			fetchOptions: {
				onResponse: () => {
					setIsLoggingOut(false);
				},
				onSuccess: () => {
					router.push('/sign-in');
				},
			},
		});
	};

	if (isPending) {
		return (
			<div className='border-border/10 flex w-full flex-col gap-y-2 rounded-lg border bg-white/5'>
				<Skeleton className='h-15 w-full rounded-lg bg-white/5' />
			</div>
		);
	}

	if (!session) return null;

	if (isMobile) {
		return (
			<Drawer>
				<DrawerTrigger className='border-border/10 flex w-full items-center justify-between gap-x-2 overflow-hidden rounded-lg border bg-white/5 p-3 hover:bg-white/10'>
					{session.user.image ? (
						<Avatar>
							<AvatarImage src={session.user.image} alt={`${session.user.name}'s profile picture`} />
						</Avatar>
					) : (
						<GeneratedAvatar seed={session.user.name} variant='initials' className='mr-3 size-9' />
					)}

					<div className='flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left'>
						<p className='w-full truncate text-sm'>{session.user.name}</p>
						<p className='w-full truncate text-xs'>{session.user.email}</p>
					</div>

					<ChevronDownIcon className='size-4 shrink-0' />
				</DrawerTrigger>

				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{session.user.name}</DrawerTitle>
						<DrawerDescription>{session.user.email}</DrawerDescription>
					</DrawerHeader>

					<DrawerFooter>
						<Button variant='outline' onClick={() => customer.portal()}>
							<CreditCardIcon />
							Billing
						</Button>

						<Button
							variant='outline'
							className='text-destructive'
							disabled={isLoggingOut}
							isLoading={isLoggingOut}
							onClick={handleLogout}
						>
							<LogOutIcon />
							Logout
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='border-border/10 flex w-full items-center justify-between gap-x-2 overflow-hidden rounded-lg border bg-white/5 p-3 hover:bg-white/10'>
				{session.user.image ? (
					<Avatar>
						<AvatarImage src={session.user.image} alt={`${session.user.name}'s profile picture`} />
					</Avatar>
				) : (
					<GeneratedAvatar seed={session.user.name} variant='initials' className='mr-3 size-9' />
				)}

				<div className='flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left'>
					<p className='w-full truncate text-sm'>{session.user.name}</p>
					<p className='w-full truncate text-xs'>{session.user.email}</p>
				</div>

				<ChevronDownIcon className='size-4 shrink-0' />
			</DropdownMenuTrigger>

			<DropdownMenuContent align='end' side='top' className='w-64'>
				<DropdownMenuLabel>
					<div className='flex flex-col gap-1'>
						<span className='truncate font-medium'>{session.user.name}</span>
						<span className='text-muted-foreground truncate text-sm font-normal'>{session.user.email}</span>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className='flex cursor-pointer items-center justify-between'
					onClick={() => customer.portal()}
				>
					Billing
					<CreditCardIcon className='size-4' />
				</DropdownMenuItem>

				<DropdownMenuItem
					disabled={isLoggingOut}
					variant='destructive'
					onClick={handleLogout}
					className='flex cursor-pointer items-center justify-between'
				>
					Logout
					<LogOutIcon className='size-4' />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
