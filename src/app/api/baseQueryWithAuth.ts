import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/app/firebase';
import { endpointsURL } from '@/shared/constants/endpointsUrl';

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

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: endpointsURL.apiBaseUrl,
  prepareHeaders: async (headers) => {
    await waitForAuthReady();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
