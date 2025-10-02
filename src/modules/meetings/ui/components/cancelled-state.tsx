import { EmptyState } from '@/components/empty-state';

export const CancelledState = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5'>
			<EmptyState
				title='Meeting cancelled'
				description='This meeting was cancelled.'
				imageSrc='/cancelled.svg'
				imageAlt='Cancelled'
			/>
		</div>
	);
};
