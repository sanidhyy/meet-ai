'use client';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { PricingCard } from '@/modules/premium/ui/components/pricing-card';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { checkout } from '@/lib/auth-client';
import { useTRPC } from '@/trpc/client';
import type { ErrorFallbackProps } from '@/types';

export const UpgradeViewError = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
	return (
		<ErrorState
			title='Error loading page'
			description={error?.message || 'Something went wrong.'}
			onRetry={resetErrorBoundary}
		/>
	);
};

export const UpgradeViewLoading = () => {
	return <LoadingState title='Loading page' description='This may take a few seconds.' />;
};

export const UpgradeView = () => {
	const trpc = useTRPC();
	const { data: currentSubscription } = useQuery(trpc.premium.getCurrentSubscription.queryOptions()); // Don't use useSuspenseQuery here to avoid hydration errors
	const { data: products } = useSuspenseQuery(trpc.premium.getProducts.queryOptions());

	return (
		<div className='flex flex-1 flex-col gap-y-10 p-4 md:px-8'>
			<div className='mt-4 flex flex-1 flex-col items-center gap-y-10'>
				<h5 className='text-2xl font-medium md:text-3xl'>
					You are on the <span className='text-primary font-semibold'>{currentSubscription?.name || 'Free'}</span> plan
				</h5>

				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					{products.map((product) => {
						const isPremium = !!currentSubscription;
						const isCurrentProduct = isPremium && currentSubscription.id === product.id;

						let buttonText = 'Upgrade';
						let onClick = () => void checkout({ products: [product.id] });

						if (isCurrentProduct) {
							buttonText = 'Manage';
							onClick = () => void window.open('/portal', '_blank', 'noopener,noreferrer');
						} else if (isPremium) {
							buttonText = 'Change Plan';
							onClick = () => void window.open('/portal', '_blank', 'noopener,noreferrer');
						}

						return (
							<PricingCard
								key={product.id}
								buttonText={buttonText}
								onClick={onClick}
								variant={product.metadata?.variant === 'highlighted' ? 'highlighted' : 'default'}
								title={product.name}
								price={product.prices?.[0].amountType === 'fixed' ? product.prices[0].priceAmount / 100 : 0}
								description={product.description}
								priceSuffix={`/${product.prices?.[0].recurringInterval || ''}`}
								features={product.benefits.map((benefit) => benefit.description)}
								badge={product.metadata?.badge as string | null}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};
