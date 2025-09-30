import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

import { DEFAULT_PAGE } from '@/config';

export const useAgentsFilters = () => {
	return useQueryStates({
		page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
		search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
	});
};
