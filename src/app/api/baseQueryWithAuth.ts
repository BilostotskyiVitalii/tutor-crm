import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/app/firebase';
import { endpointsURL } from '@/shared/constants/endpointsUrl';

const rawBaseQuery = fetchBaseQuery({ baseUrl: endpointsURL.apiBaseUrl });

async function waitForAuthReady(): Promise<void> {
  if (auth.currentUser) {
    return;
  }
  await new Promise<void>((resolve) => {
    const unsub = onAuthStateChanged(auth, () => {
      unsub();
      resolve();
    });
  });
}

async function getAuthToken(): Promise<string | null> {
  await waitForAuthReady();
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  return user.getIdToken(true);
}

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const token = await getAuthToken();

  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const finalArgs: FetchArgs =
    typeof args === 'string' ? { url: args } : { ...args };

  finalArgs.headers = {
    ...(finalArgs.headers as Record<string, string>),
    ...headers,
  };

  return rawBaseQuery(finalArgs, api, extraOptions);
};
