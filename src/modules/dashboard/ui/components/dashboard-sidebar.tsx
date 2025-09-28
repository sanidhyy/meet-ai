'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BotIcon, StarIcon, VideoIcon } from 'lucide-react';

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
import { cn } from '@/lib/utils';

import { DashboardUserButton } from './dashboard-user-button';

const FIRST_SECTION = [
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
] as const;

const SECOND_SECTION = [
	{
		href: '/upgrade',
		icon: StarIcon,
		label: 'Upgrade',
	},
] as const;

interface DashboardSidebarGroupProps {
	item: (typeof FIRST_SECTION | typeof SECOND_SECTION)[number];
	isActive: boolean;
}

const DashboardSidebarGroup = ({ item: { href, icon: Icon, label }, isActive }: DashboardSidebarGroupProps) => (
	<SidebarMenuItem key={href}>
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

				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{SECOND_SECTION.map((item) => (
								<DashboardSidebarGroup key={item.href} item={item} isActive={pathname === item.href} />
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className='text-white'>
				<DashboardUserButton />
			</SidebarFooter>
		</Sidebar>
	);
};
