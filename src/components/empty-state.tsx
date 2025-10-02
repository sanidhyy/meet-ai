'use client';

interface EmptyStateProps {
	description: string;
	title: string;
	imageSrc?: string;
	imageAlt?: string;
}

export const EmptyState = ({ description, title, imageSrc = '/empty.svg', imageAlt = 'Empty' }: EmptyStateProps) => {
	return (
		<div className='flex flex-col items-center justify-center'>
			<img src={imageSrc} alt={imageAlt} className='size-60' />

			<div className='mx-auto flex max-w-md flex-col gap-y-6 text-center'>
				<h6 className='text-lg font-medium'>{title}</h6>
				<p className='text-muted-foreground text-sm'>{description}</p>
			</div>
		</div>
	);
};
