import axios from 'axios';

import { endpointsURL } from '@/shared/constants/endpointsUrl';

export const axs = axios.create({
  baseURL: endpointsURL.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

axs.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  },
);
