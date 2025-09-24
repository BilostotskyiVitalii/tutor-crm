import { createApi } from '@reduxjs/toolkit/query/react';

import { apiURL } from '@/constants/apiUrl';
import type { RootState } from '@/store';
import { baseQueryWithAuth } from '@/store/baseQueryWithAuth';
import type { Student, StudentData, UpdateUser } from '@/types/studentTypes';

const { students } = apiURL;

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Students'],
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], string>({
      query: (uid) => `${students}/${uid}.json`,
      transformResponse: (response: Record<string, StudentData> | null) =>
        response
          ? Object.entries(response).map(([id, val]) => ({ id, ...val }))
          : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Students' as const, id })),
              { type: 'Students', id: 'LIST' },
            ]
          : [{ type: 'Students', id: 'LIST' }],
    }),

    addStudent: builder.mutation<Student, StudentData>({
      queryFn: async (data, api, _extraOptions, baseQuery) => {
        const uid = (api.getState() as RootState).user.id!;
        const result = await baseQuery({
          url: `${students}/${uid}.json`,
          method: 'POST',
          body: data,
        });

        if (result.error) {
          return { error: result.error };
        }

        const id = (result.data as { name: string }).name;
        return { data: { id, ...data } as Student };
      },
      invalidatesTags: [{ type: 'Students', id: 'LIST' }],
    }),

    updateStudent: builder.mutation<Student, UpdateUser>({
      queryFn: async ({ id, data }, api, _extraOptions, baseQuery) => {
        const uid = (api.getState() as RootState).user.id!;
        const result = await baseQuery({
          url: `${students}/${uid}/${id}.json`,
          method: 'PATCH',
          body: data,
        });
        if (result.error) {
          return { error: result.error };
        }
        return { data: { id, ...data } as Student };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Students', id },
        { type: 'Students', id: 'LIST' },
      ],
    }),

    deleteStudent: builder.mutation<void, string>({
      queryFn: async (id, api, _extraOptions, baseQuery) => {
        const uid = (api.getState() as RootState).user.id!;
        const result = await baseQuery({
          url: `${students}/${uid}/${id}.json`,
          method: 'DELETE',
        });
        if (result.error) {
          return { error: result.error };
        }
        return { data: undefined };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Students', id },
        { type: 'Students', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
