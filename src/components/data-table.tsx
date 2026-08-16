'use client';

import { useTable, type ColumnDef, type RowData } from '@tanstack/react-table';

import { features, type DataTableFeatures } from '@/components/data-table-features';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DataTableProps<TData extends RowData> {
	columns: ColumnDef<DataTableFeatures, TData>[];
	data: TData[];
	onRowClick?: (row: TData) => void;
	emptyMessage?: string;
}

export function DataTable<TData extends RowData>({
	columns,
	data,
	emptyMessage = 'No results.',
	onRowClick,
}: DataTableProps<TData>) {
	const table = useTable({
		features,
		columns,
		data,
	});

	return (
		<div className='bg-background overflow-hidden rounded-lg border'>
			<Table>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								onClick={() => onRowClick?.(row.original)}
								className={cn(!!onRowClick && 'cursor-pointer')}
							>
								{row.getAllCells().map((cell) => (
									<TableCell key={cell.id} className='p-4 text-sm'>
										<table.FlexRender cell={cell} />
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className='text-muted-foreground h-19 text-center'>
								{emptyMessage}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
