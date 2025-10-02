import type { PropsWithChildren } from 'react';

const CallLayout = ({ children }: PropsWithChildren) => {
	return <div className='h-screen bg-black'>{children}</div>;
};

export default CallLayout;
