import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { endpointsURL } from '@/shared/constants/endpointsUrl';

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: endpointsURL.apiBaseUrl,
  credentials: 'include',
  prepareHeaders: (headers) => headers,
});
