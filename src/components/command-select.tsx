import { useState, type PropsWithChildren } from 'react';

import { ChevronsUpDownIcon, Loader2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface CommandSelectProps {
	onSelect: (value: string) => void;
	options: Array<
		PropsWithChildren & {
			id: string;
			value: string;
		}
	>;
	value: string;
	className?: string;
	isSearching?: boolean;
	onSearch?: (value: string) => void;
	placeholder?: string;
	emptyMessage?: string;
}

export const CommandSelect = ({
	onSelect,
	options,
	value,
	className,
	isSearching,
	onSearch,
	placeholder = 'Select an option',
	emptyMessage = 'No options found',
}: CommandSelectProps) => {
	const [open, setOpen] = useState(false);
	const selectedOption = options.find((option) => option.value === value);

	return (
		<>
			<Button
				type='button'
				variant='outline'
				className={cn('h-9 justify-between px-2 font-normal', !selectedOption && 'text-muted-foreground', className)}
				onClick={() => setOpen(true)}
			>
				<div>{selectedOption?.children ?? placeholder}</div>

				<ChevronsUpDownIcon />
			</Button>

			<CommandResponsiveDialog
				shouldFilter={!onSearch}
				open={open}
				onOpenChange={(open) => {
					onSearch?.('');
					setOpen(open);
				}}
			>
				<CommandInput placeholder='Search...' onValueChange={onSearch} />
				<CommandList>
					<CommandEmpty>
						{isSearching ? (
							<div className='flex items-center justify-center'>
								<Loader2Icon className='size-4 animate-spin' aria-label='Searching...' />
							</div>
						) : (
							<span className='text-muted-foreground text-sm'>{emptyMessage}</span>
						)}
					</CommandEmpty>

					{options.map(({ id, value, children }) => (
						<CommandItem
							key={id}
							onSelect={() => {
								onSelect(value);
								onSearch?.('');
								setOpen(false);
							}}
						>
							{children}
						</CommandItem>
					))}
				</CommandList>
			</CommandResponsiveDialog>
		</>
	);
};
