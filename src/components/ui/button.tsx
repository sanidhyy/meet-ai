import * as React from 'react';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	"focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		defaultVariants: {
			size: 'default',
			variant: 'default',
		},
		variants: {
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				icon: 'size-9',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
			},
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 text-white',
				ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline',
				outline:
					'bg-background hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 border shadow-xs',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			},
		},
	}
);

export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

function Button({
	asChild = false,
	className,
	children,
	disabled = false,
	isLoading = false,
	variant,
	size,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			data-slot='button'
			className={cn(buttonVariants({ className, size, variant }))}
			disabled={isLoading || disabled}
			{...props}
		>
			{isLoading && <Loader2Icon className='animate-spin' strokeWidth={2.5} aria-label='Loading...' />}
			<Slottable>{children}</Slottable>
		</Comp>
	);
}

export { Button, buttonVariants };
