import {
  fetchBaseQuery,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { notification } from 'antd';

import { apiURL } from '@/constants/apiUrl';
import type { RootState } from '@/store';
import { setUser } from '@/store/userSlice';

const rawBaseQuery = fetchBaseQuery({ baseUrl: apiURL.base });

export const baseQueryWithAuth: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const state = api.getState() as RootState;
  const token = state.user.token;
  const refreshToken = state.user.refreshToken;

  let newArgs = args;

  if (!token) {
    return rawBaseQuery(args, api, extraOptions);
  }

  // Добавляем токен в URL (Firebase Realtime DB формат)
  if (typeof args === 'string') {
    newArgs = `${args}${args.includes('?') ? '&' : '?'}auth=${token}`;
  } else if ('url' in args) {
    newArgs = {
      ...args,
      url: `${args.url}${args.url.includes('?') ? '&' : '?'}auth=${token}`,
    };
  }

  // Первый запрос
  let result = await rawBaseQuery(newArgs, api, extraOptions);

  // Если токен просрочен -> обновляем
  const error = result.error as FetchBaseQueryError | undefined;
  if (error && 'status' in error && error.status === 401 && refreshToken) {
    try {
      const refreshResult = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        },
      );

      const data = await refreshResult.json();

      if (data.id_token) {
        // Сохраняем новый токен в Redux
        api.dispatch(
          setUser({
            ...state.user,
            token: data.id_token,
            refreshToken: data.refresh_token,
          }),
        );

        // Повторяем запрос с новым токеном
        let retryArgs = args;
        if (typeof args === 'string') {
          retryArgs = `${args}${args.includes('?') ? '&' : '?'}auth=${data.id_token}`;
        } else if ('url' in args) {
          retryArgs = {
            ...args,
            url: `${args.url}${args.url.includes('?') ? '&' : '?'}auth=${data.id_token}`,
          };
        }

        result = await rawBaseQuery(retryArgs, api, extraOptions);
      }
    } catch {
      notification.error({ message: 'Token refresh failed' });
    }
  }

  return result;
};
