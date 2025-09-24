import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { apiURL } from '@/constants/apiUrl';
import type { RootState } from '@/store';
import type { Student, StudentData, UpdateUser } from '@/types/studentTypes';

const { base, students } = apiURL;

const rawBaseQuery = fetchBaseQuery({ baseUrl: base });

const baseQueryWithAuth: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const state = api.getState() as RootState;
  const token = state.user.token;
  const userId = state.user.id;

  let newArgs = args;

  if (!token) {
    return rawBaseQuery(args, api, extraOptions);
  }

  if (typeof args === 'string') {
    newArgs = `${args}${args.includes('?') ? '&' : '?'}auth=${token}`;
    if (args.includes(`${students}.json`) && args.includes('orderBy')) {
      newArgs += `&equalTo="${userId}"`;
    }
  } else if ('url' in args) {
    newArgs = {
      ...args,
      url: `${args.url}${args.url.includes('?') ? '&' : '?'}auth=${token}`,
    };

    if (args.url.includes(`${students}.json`) && args.url.includes('orderBy')) {
      newArgs.url += `&equalTo="${userId}"`;
    }

    if (args.method === 'POST' && args.body) {
      newArgs.body = { ...args.body, tutorId: userId };
    }
  }

  return rawBaseQuery(newArgs, api, extraOptions);
};

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Students'],
  endpoints: (build) => ({
    getStudents: build.query<Student[], string | void>({
      query: (userId) =>
        `${students}.json?orderBy="tutorId"&equalTo="${userId}"`,
      transformResponse: (response: Record<string, StudentData> | null) =>
        response
          ? Object.entries(response).map(([id, value]) => ({ id, ...value }))
          : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Students' as const, id })),
              { type: 'Students', id: 'LIST' },
            ]
          : [{ type: 'Students', id: 'LIST' }],
    }),

    addStudent: build.mutation<Student, StudentData>({
      query: (student) => ({
        url: `${students}.json`,
        method: 'POST',
        body: student,
      }),
      invalidatesTags: [{ type: 'Students', id: 'LIST' }],
    }),

    updateStudent: build.mutation<Student, UpdateUser>({
      query: ({ id, data }) => ({
        url: `${students}/${id}.json`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Students', id },
        { type: 'Students', id: 'LIST' },
      ],
    }),

    deleteStudent: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${students}/${id}.json`,
        method: 'DELETE',
      }),
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
