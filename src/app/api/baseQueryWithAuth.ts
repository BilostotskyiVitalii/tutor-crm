import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { endpointsURL } from '@/shared/constants/endpointsUrl';

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: endpointsURL.apiBaseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
