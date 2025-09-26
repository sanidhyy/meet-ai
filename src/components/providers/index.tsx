import type { PropsWithChildren } from 'react';

import { GoogleOneTap } from './google-one-tap';

export const Providers = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<>
			{children}

			<GoogleOneTap />
		</>
	);
};
