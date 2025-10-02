import { Button } from '@/components/ui/button';

interface DataPaginationProps {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const DataPagination = ({ page, totalPages, onPageChange }: DataPaginationProps) => {
	const filterPage = Math.min(page, totalPages || 1);

	return (
		<div className='flex items-center justify-between'>
			<div className='text-muted-foreground flex-1 text-sm'>
				Page {filterPage} of {totalPages || 1}
			</div>

			<div className='flex items-center justify-end gap-x-2 py-4'>
				<Button disabled={page === 1} variant='outline' size='sm' onClick={() => onPageChange(Math.max(1, page - 1))}>
					Previous
				</Button>
				<Button
					disabled={filterPage === totalPages || totalPages === 0}
					variant='outline'
					size='sm'
					onClick={() => onPageChange(Math.min(totalPages, filterPage + 1))}
				>
					Next
				</Button>
			</div>
		</div>
	);
};
