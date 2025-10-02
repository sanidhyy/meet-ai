import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs/server';

import { DEFAULT_PAGE } from '@/config';
import { MeetingStatus } from '@/db/schema';

export const filtersSearchParams = {
	agentId: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
	page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
	search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
	status: parseAsStringEnum(Object.values(MeetingStatus)),
};

export const loadSearchParams = createLoader(filtersSearchParams);
