import { Button } from '@/components/ui/button';
import { env } from '@/env/client';

const HomePage = () => {
	return (
		<div>
			<h1 className='text-4xl font-bold text-green-500'>Home Page</h1>
			<Button>Test</Button>
			{env.NEXT_PUBLIC_APP_BASE_URL}
		</div>
	);
};
export default HomePage;
