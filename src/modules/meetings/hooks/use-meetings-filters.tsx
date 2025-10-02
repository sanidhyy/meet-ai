import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';

import { DEFAULT_PAGE } from '@/config';
import { MeetingStatus } from '@/db/schema';

export const useMeetingsFilters = () => {
	return useQueryStates({
		agentId: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
		page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
		search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
		status: parseAsStringEnum(Object.values(MeetingStatus)),
	});
};
