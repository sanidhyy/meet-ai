'use client';

import { useEffect, useState } from 'react';

import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

import { DashboardCommand } from './dashboard-command';

export const DashboardNavbar = () => {
	const { state, toggleSidebar, isMobile } = useSidebar();
	const [commandOpen, setCommandOpen] = useState(false);

	useEffect(() => {
		const handleCommandToggleKey = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setCommandOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', handleCommandToggleKey);

		return () => document.removeEventListener('keydown', handleCommandToggleKey);
	}, []);

	return (
		<>
			<DashboardCommand open={commandOpen} setOpen={setCommandOpen} />

			<nav className='bg-background flex items-center gap-x-2 border-b px-4 py-3'>
				<Button className='size-9' variant='outline' onClick={toggleSidebar}>
					{state === 'collapsed' || isMobile ? <PanelLeftIcon /> : <PanelLeftCloseIcon />}
				</Button>

				<Button
					variant='outline'
					size='sm'
					className='text-muted-foreground hover:text-muted-foreground h-9 w-[240px] cursor-text justify-start font-normal'
					onClick={() => setCommandOpen(true)}
				>
					<SearchIcon />
					Search
					<kbd className='bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none'>
						<span className='text-xs'>&#8984;K</span>
					</kbd>
				</Button>
			</nav>
		</>
	);
};
