import { createApi } from '@reduxjs/toolkit/query/react';

import { apiURL } from '@/constants/apiUrl';
import type { RootState } from '@/store';
import { baseQueryWithAuth } from '@/store/baseQueryWithAuth';
import type { Group, GroupData, UpdateGroup } from '@/types/groupTypes';

const { groups } = apiURL;

export const groupsApi = createApi({
  reducerPath: 'groupsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Groups'],
  endpoints: (builder) => ({
    getGroups: builder.query<Group[], string>({
      query: (uid) => `${groups}/${uid}.json`,
      transformResponse: (response: Record<string, GroupData> | null) =>
        response
          ? Object.entries(response).map(([id, val]) => ({ id, ...val }))
          : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Groups' as const, id })),
              { type: 'Groups', id: 'LIST' },
            ]
          : [{ type: 'Groups', id: 'LIST' }],
    }),

    addGroup: builder.mutation<Group, GroupData>({
      queryFn: async (data, api, _extraOptions, baseQuery) => {
        const uid = (api.getState() as RootState).user.id!;
        const result = await baseQuery({
          url: `${groups}/${uid}.json`,
          method: 'POST',
          body: data,
        });

        if (result.error) {
          return { error: result.error };
        }

        const id = (result.data as { name: string }).name;
        return { data: { id, ...data } as Group };
      },
      invalidatesTags: [{ type: 'Groups', id: 'LIST' }],
    }),

    updateGroup: builder.mutation<Group, UpdateGroup>({
      queryFn: async ({ id, data }, api, _extraOptions, baseQuery) => {
        const uid = (api.getState() as RootState).user.id!;
        const result = await baseQuery({
          url: `${groups}/${uid}/${id}.json`,
          method: 'PATCH',
          body: data,
        });
        if (result.error) {
          return { error: result.error };
        }
        return { data: { id, ...data } as Group };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Groups', id },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    deleteGroup: builder.mutation<void, string>({
      queryFn: async (id, api, _extraOptions, baseQuery) => {
        const uid = (api.getState() as RootState).user.id!;
        const result = await baseQuery({
          url: `${groups}/${uid}/${id}.json`,
          method: 'DELETE',
        });
        if (result.error) {
          return { error: result.error };
        }
        return { data: undefined };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Groups', id },
        { type: 'Groups', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useAddGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupsApi;
