import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { endpointsURL } from '@/shared/constants/endpointsUrl';
import type { RootState } from '@/store';

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: endpointsURL.apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
