import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithAuth } from '@/app/api/baseQueryWithAuth';
import type {
  Group,
  GroupData,
  UpdateGroup,
} from '@/features/groups/types/groupTypes';
import { endpointsURL } from '@/shared/constants/endpointsUrl';

const { groups } = endpointsURL;

export const groupsApi = createApi({
  reducerPath: 'groupsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Groups'],
  endpoints: (builder) => ({
    getGroups: builder.query<Group[], void>({
      query: () => ({ url: groups, method: 'GET' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Groups' as const, id })),
              { type: 'Groups', id: 'LIST' },
            ]
          : [{ type: 'Groups', id: 'LIST' }],
    }),

    getGroupById: builder.query<Group, string>({
      query: (id) => ({ url: `${groups}/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'Groups', id }],
    }),

    addGroup: builder.mutation<Group, GroupData>({
      query: (newGroup) => ({ url: groups, method: 'POST', body: newGroup }),
      invalidatesTags: [{ type: 'Groups', id: 'LIST' }],
    }),

    updateGroup: builder.mutation<Group, UpdateGroup>({
      query: ({ id, data }) => ({
        url: `${groups}/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Groups', id }],
    }),

    deleteGroup: builder.mutation<void, string>({
      query: (id) => ({ url: `${groups}/${id}`, method: 'DELETE' }),
      invalidatesTags: (_res, _err, id) => [{ type: 'Groups', id }],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetGroupByIdQuery,
  useAddGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupsApi;
