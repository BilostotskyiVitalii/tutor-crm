import { createApi } from '@reduxjs/toolkit/query/react';

import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/features/auth/types/authTypes';
import { baseQueryWithAuth } from '@/shared/api/baseQueryWithAuth';
import { endpointsURL } from '@/shared/constants/endpointsUrl';

const {
  apiLogin,
  apiRegister,
  apiProfile,
  apiResetPassword,
  apiConfirmPassword,
  apiLogout,
} = endpointsURL;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthUser, LoginRequest>({
      query: (credentials) => ({
        url: apiLogin,
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<AuthUser, RegisterRequest>({
      query: (data) => ({
        url: apiRegister,
        method: 'POST',
        body: data,
      }),
    }),

    fetchProfile: builder.query<AuthUser, void>({
      query: () => ({ url: apiProfile }),
      providesTags: ['Auth'],
    }),

    resetPassword: builder.mutation<{ success: boolean }, ResetPasswordRequest>(
      {
        query: (data) => ({
          url: apiResetPassword,
          method: 'POST',
          body: data,
        }),
      },
    ),

    confirmResetPassword: builder.mutation<
      { success: boolean },
      { oobCode: string; newPassword: string }
    >({
      query: (data) => ({
        url: apiConfirmPassword,
        method: 'POST',
        body: data,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: apiLogout,
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
  useConfirmResetPasswordMutation,
  useLogoutMutation,
} = authApi;
