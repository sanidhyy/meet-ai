'use client';

interface EmptyStateProps {
	description: string;
	title: string;
}

export const EmptyState = ({ description, title }: EmptyStateProps) => {
	return (
		<div className='flex flex-col items-center justify-center'>
			<img src='/empty.svg' alt='Empty' className='size-60' />

			<div className='mx-auto flex max-w-md flex-col gap-y-6 text-center'>
				<h6 className='text-lg font-medium'>{title}</h6>
				<p className='text-muted-foreground text-sm'>{description}</p>
			</div>
		</div>
	);
};
