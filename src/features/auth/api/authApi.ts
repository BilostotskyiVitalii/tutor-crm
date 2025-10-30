import { createApi } from '@reduxjs/toolkit/query/react';

import { endpointsURL } from '@/shared/constants/endpointsUrl';

export interface AuthState {
  id: string | null;
  email: string | null;
  token: string | null;
  nickName: string | null;
  avatar: string | null;
  createdAt: number | null;
  refreshToken: string | null;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  nickName: string;
}

interface GoogleLoginRequest {
  idToken: string;
}

interface ResetPasswordRequest {
  email: string;
}

// Ответы с сервера
interface LoginResponse {
  uid: string;
  email: string;
  token: string;
  nickName?: string;
  avatar?: string | null;
}

interface RegisterResponse {
  uid: string;
  email: string;
  token: string;
  nickName?: string;
}

interface GoogleLoginResponse {
  uid: string;
  email: string;
  token: string;
  nickName?: string;
  avatar?: string | null;
}

import { baseQueryWithAuth } from '@/app/api/baseQueryWithAuth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthState, LoginRequest>({
      query: (credentials) => ({
        url: endpointsURL.apiLogin,
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: LoginResponse): AuthState => ({
        id: response.uid,
        email: response.email,
        token: response.token,
        nickName: response.nickName ?? response.email,
        avatar: response.avatar ?? null,
        createdAt: Date.now(),
        refreshToken: null,
      }),
    }),
    register: builder.mutation<AuthState, RegisterRequest>({
      query: (data) => ({
        url: endpointsURL.apiRegister,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: RegisterResponse): AuthState => ({
        id: response.uid,
        email: response.email,
        token: response.token,
        nickName: response.nickName ?? response.email,
        avatar: null,
        createdAt: Date.now(),
        refreshToken: null,
      }),
    }),
    googleLogin: builder.mutation<AuthState, GoogleLoginRequest>({
      query: (data) => ({
        url: endpointsURL.apiGoogleLogin,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: GoogleLoginResponse): AuthState => ({
        id: response.uid,
        email: response.email,
        token: response.token,
        nickName: response.nickName ?? response.email,
        avatar: response.avatar ?? null,
        createdAt: Date.now(),
        refreshToken: null,
      }),
    }),
    fetchProfile: builder.query<AuthState, void>({
      query: () => ({ url: endpointsURL.apiProfile, method: 'GET' }),
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useFetchProfileQuery,
  useResetPasswordMutation,
} = authApi;
