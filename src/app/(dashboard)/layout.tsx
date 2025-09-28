import type { PropsWithChildren } from 'react';

import { DashboardSidebar } from '@/modules/dashboard/ui/components/dashboard-sidebar';

import { SidebarProvider } from '@/components/ui/sidebar';

const DashboardLayout = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<SidebarProvider>
			<DashboardSidebar />

			<main className='bg-muted flex h-screen w-screen flex-col'>{children}</main>
		</SidebarProvider>
	);
};

export default DashboardLayout;
