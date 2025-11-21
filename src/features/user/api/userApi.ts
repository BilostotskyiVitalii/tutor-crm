import { createApi } from '@reduxjs/toolkit/query/react';

import type { UpdatedUser, UserUpdates } from '@/features/user/types/userTypes';
import { baseQueryWithAuth } from '@/shared/api/baseQueryWithAuth';
import { endpointsURL } from '@/shared/constants/endpointsUrl';

const { user } = endpointsURL;

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    updateUser: builder.mutation<UpdatedUser, Partial<UserUpdates>>({
      query: (data) => ({
        url: `${user}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: () => [{ type: 'User' }],
    }),
  }),
});

export const { useUpdateUserMutation } = userApi;
