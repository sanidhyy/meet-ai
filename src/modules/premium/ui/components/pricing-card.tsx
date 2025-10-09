import { cva, type VariantProps } from 'class-variance-authority';
import { CircleCheckIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, formatPrice } from '@/lib/utils';

const pricingCardVariants = cva('w-full rounded-lg p-4 py-6', {
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'bg-white text-black',
			highlighted: 'bg-linear-to-br from-[#093C23] to-[#051B16] text-white',
		},
	},
});

const pricingCardIconVariants = cva('size-5', {
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'fill-primary text-white',
			highlighted: 'fill-white text-black',
		},
	},
});

const pricingCardSecondaryTextVariants = cva('text-neutral-700', {
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'text-neutral-700',
			highlighted: 'text-neutral-300',
		},
	},
});

const pricingCardBadgeVariants = cva('p-1 text-xs font-normal text-black', {
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'bg-primary/20',
			highlighted: 'bg-[#F5B797]',
		},
	},
});

interface PricingCardProps extends VariantProps<typeof pricingCardVariants> {
	buttonText: string;
	features: string[];
	onClick: () => void;
	price: number;
	priceSuffix: string;
	title: string;
	badge?: string | null;
	className?: string;
	description?: string | null;
}

export const PricingCard = ({
	buttonText,
	features,
	onClick,
	price,
	priceSuffix,
	title,
	badge,
	className,
	description,
	variant = 'default',
}: PricingCardProps) => {
	return (
		<div className={cn('border', pricingCardVariants({ variant }), className)}>
			<div className='flex items-end justify-between gap-x-4'>
				<div className='flex flex-col gap-y-2'>
					<div className='flex items-center gap-x-2'>
						<h6 className='text-xl font-medium'>{title}</h6>
						{!!badge && <Badge className={cn(pricingCardBadgeVariants({ variant }))}>{badge}</Badge>}
					</div>

					{!!description && (
						<p className={cn('text-xs', pricingCardSecondaryTextVariants({ variant }))}>{description}</p>
					)}
				</div>

				<div className='flex shrink-0 items-end gap-x-0.5'>
					<h4 className='text-3xl font-medium'>{formatPrice(price)}</h4>
					<span className={cn(pricingCardSecondaryTextVariants({ variant }))}>{priceSuffix}</span>
				</div>
			</div>

			<div className='py-6'>
				<Separator className='text-[#5D6B68] opacity-10' />
			</div>

			<Button
				className='w-full'
				size='lg'
				variant={variant === 'highlighted' ? 'default' : 'outline'}
				onClick={onClick}
			>
				{buttonText}
			</Button>

			<div className='mt-6 flex flex-col gap-y-2'>
				<p className='font-medium uppercase'>Features</p>

				<ul className={cn('flex flex-col gap-y-2.5', pricingCardSecondaryTextVariants({ variant }))}>
					{features.map((feature) => (
						<li key={feature} className='flex items-center gap-x-2.5'>
							<CircleCheckIcon className={cn(pricingCardIconVariants({ variant }))} />
							{feature}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
