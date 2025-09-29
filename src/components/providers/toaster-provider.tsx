'use client';

import { Toaster } from 'react-hot-toast';

export const ToasterProvider = () => {
	return (
		<Toaster
			position='top-center'
			toastOptions={{
				error: {
					style: {
						backgroundColor: 'rgb(244 63 94 / 0.8)',
						color: '#fff1f2',
					},
				},
				style: {
					backgroundColor: 'rgb(255 255 255 / 0.8)',
					borderRadius: '9999px',
					color: 'rgb(41 30 87)',
				},
				success: {
					style: {
						backgroundColor: 'rgb(16 185 129 / 0.8)',
						color: '#ecfdf5',
					},
				},
			}}
		/>
	);
};
