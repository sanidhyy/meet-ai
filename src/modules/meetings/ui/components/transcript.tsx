import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { formatDate } from 'date-fns';
import { SearchIcon } from 'lucide-react';
import Highlighter from 'react-highlight-words';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateAvatarUri } from '@/lib/avatar';
import { useTRPC } from '@/trpc/client';

interface TranscriptProps {
	meetingId: string;
}

export const Transcript = ({ meetingId }: TranscriptProps) => {
	const trpc = useTRPC();
	const { data: transcript } = useQuery(trpc.meetings.getTranscript.queryOptions({ id: meetingId }));

	const [searchQuery, setSearchQuery] = useState('');

	const filteredTranscript = (transcript || []).filter((item) =>
		item.text.toString().toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className='flex w-full flex-col gap-y-4 rounded-lg border bg-white px-4 py-5'>
			<p className='text-sm font-medium'>Transcript</p>

			<div className='relative'>
				<Input
					type='search'
					placeholder='Search Transcript'
					className='h-9 w-[240px] pl-9'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<SearchIcon className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
			</div>

			<ScrollArea>
				<div className='flex flex-col gap-y-4'>
					{filteredTranscript.map((item) => {
						return (
							<div key={item.start_ts} className='hover:bg-muted flex flex-col gap-y-2 rounded-md border p-4'>
								<div className='flex items-center gap-x-2'>
									<Avatar className='size-6'>
										<AvatarImage
											src={item.user.image ?? generateAvatarUri({ seed: item.user.name, variant: 'initials' })}
											alt='User Avatar'
										/>
									</Avatar>

									<p className='text-sm font-medium'>{item.user.name}</p>
									<p className='text-sm font-medium text-blue-500'>
										{formatDate(new Date(0, 0, 0, 0, 0, 0, item.start_ts), 'mm:ss')}
									</p>
								</div>

								<Highlighter
									className='text-sm text-neutral-700'
									highlightClassName='bg-yellow-200'
									searchWords={[searchQuery]}
									textToHighlight={item.text}
									autoEscape
								/>
							</div>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
};
