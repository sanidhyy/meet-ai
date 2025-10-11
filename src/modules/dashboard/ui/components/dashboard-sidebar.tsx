'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { BotIcon, CreditCardIcon, SparklesIcon, StarIcon, VideoIcon, type LucideIcon } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { LINKS } from '@/config';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

import { DashboardTrial } from './dashboard-trial';
import { DashboardUserButton } from './dashboard-user-button';

type DashboardSidebarItem = {
	href: string;
	icon: LucideIcon;
	label: string;
};

const FIRST_SECTION: DashboardSidebarItem[] = [
	{
		href: '/meetings',
		icon: VideoIcon,
		label: 'Meetings',
	},
	{
		href: '/agents',
		icon: BotIcon,
		label: 'Agents',
	},
];

interface DashboardSidebarGroupProps {
	item: DashboardSidebarItem;
	isActive: boolean;
}

const DashboardSidebarGroup = ({ item: { href, icon: Icon, label }, isActive }: DashboardSidebarGroupProps) => (
	<SidebarMenuItem>
		<SidebarMenuButton
			className={cn(
				'from-sidebar-accent via-sidebar/50 to-sidebar/50 h-10 border border-transparent from-5% via-30% hover:border-[#5d5b68]/10 hover:bg-linear-to-r/oklch',
				isActive && 'border-[#5d6b68]/10 bg-linear-to-r/oklch'
			)}
			isActive={isActive}
			asChild
		>
			<Link href={href}>
				<Icon className='size-5' />

				<span className='text-sm font-medium tracking-tight'>{label}</span>
			</Link>
		</SidebarMenuButton>
	</SidebarMenuItem>
);

export const DashboardSidebar = () => {
	const pathname = usePathname();
	const trpc = useTRPC();

	const { data: currentSubscription, isLoading: isLoadingCurrentSubscription } = useQuery(
		trpc.premium.getCurrentSubscription.queryOptions()
	);

	const hasSubscription = !!currentSubscription;

	const SECOND_SECTION: DashboardSidebarItem[] = [
		{
			href: '/settings',
			icon: SparklesIcon,
			label: 'AI Settings',
		},
		hasSubscription
			? {
					href: '/upgrade',
					icon: CreditCardIcon,
					label: 'Manage Subscription',
				}
			: {
					href: '/upgrade',
					icon: StarIcon,
					label: 'Upgrade',
				},
	];

	return (
		<Sidebar>
			<SidebarHeader className='text-sidebar-accent-foreground'>
				<Link href='/' className='flex items-center gap-2 px-2 pt-2'>
					<img src='/logo.svg' alt='Meet.AI logo' className='size-[36px]' />
					<p className='text-2xl font-bold'>Meet.AI</p>
				</Link>
			</SidebarHeader>

			<div className='px-4 py-2'>
				<Separator className='text-[#5d6b6a] opacity-10' />
			</div>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{FIRST_SECTION.map((item) => (
								<DashboardSidebarGroup key={item.href} item={item} isActive={pathname === item.href} />
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<div className='px-4 py-2'>
					<Separator className='text-[#5d6b6a] opacity-10' />
				</div>

				{isLoadingCurrentSubscription ? (
					<div className='space-y-1 px-3 py-1'>
						<Skeleton className='h-10 w-full bg-white/5' />
						<Skeleton className='h-10 w-full bg-white/5' />
					</div>
				) : (
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{SECOND_SECTION.map((item) => (
									<DashboardSidebarGroup key={item.href} item={item} isActive={pathname === item.href} />
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}

				<div className='px-4 py-2'>
					<Separator className='text-[#5d6b6a] opacity-10' />
				</div>

				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									className='from-sidebar-accent via-sidebar/50 to-sidebar/50 h-10 border border-transparent from-5% via-30% hover:border-[#5d5b68]/10 hover:bg-linear-to-r/oklch'
									asChild
								>
									<Link href={LINKS.SOURCE_CODE} target='_blank' rel='noopener noreferrer'>
										<img src='/github-white.svg' alt='GitHub' className='size-5' />

										<span className='text-sm font-medium tracking-tight'>Source Code</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className='text-white'>
				<DashboardTrial />
				<DashboardUserButton />
			</SidebarFooter>
		</Sidebar>
	);
};
