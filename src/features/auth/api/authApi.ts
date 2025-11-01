import { createApi } from '@reduxjs/toolkit/query/react';

import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/features/auth/types/authTypes';
import { baseQueryWithAuth } from '@/shared/api/baseQueryWithAuth';
import { endpointsURL } from '@/shared/constants/endpointsUrl';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthUser, LoginRequest>({
      query: (credentials) => ({
        url: endpointsURL.apiLogin,
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<AuthUser, RegisterRequest>({
      query: (data) => ({
        url: endpointsURL.apiRegister,
        method: 'POST',
        body: data,
      }),
    }),

    fetchProfile: builder.query<AuthUser, void>({
      query: () => ({ url: endpointsURL.apiProfile }),
      providesTags: ['Auth'],
    }),

    resetPassword: builder.mutation<{ success: boolean }, ResetPasswordRequest>(
      {
        query: (data) => ({
          url: endpointsURL.apiResetPassword,
          method: 'POST',
          body: data,
        }),
      },
    ),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: endpointsURL.apiLogout,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useFetchProfileQuery,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
