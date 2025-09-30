'use client';

import { useState, type JSX } from 'react';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button, type ButtonProps } from '@/components/ui/button';

interface UseConfirmProps {
	title: string;
	message: string;
	variant?: ButtonProps['variant'];
}

export const useConfirm = ({
	title,
	message,
	variant = 'destructive',
}: UseConfirmProps): [() => JSX.Element, () => Promise<unknown>] => {
	const [isOpen, setIsOpen] = useState(false);
	const [resolver, setResolver] = useState<(value: boolean) => void>();

	const confirm = () => {
		setIsOpen(true);
		return new Promise((resolve) => {
			setResolver(() => resolve);
		});
	};

	const handleClose = () => {
		setIsOpen(false);
		resolver?.(false);
	};

	const handleConfirm = () => {
		setIsOpen(false);
		resolver?.(true);
	};

	const ConfirmationDialog = () => (
		<ResponsiveDialog title={title} description={message} open={isOpen} onOpenChange={handleClose}>
			<div className='flex w-full flex-col-reverse items-center justify-end gap-2 pt-4 lg:flex-row'>
				<Button onClick={handleClose} variant='outline' className='w-full lg:w-auto'>
					Cancel
				</Button>
				<Button onClick={handleConfirm} variant={variant} className='w-full lg:w-auto'>
					Confirm
				</Button>
			</div>
		</ResponsiveDialog>
	);

	return [ConfirmationDialog, confirm];
};
