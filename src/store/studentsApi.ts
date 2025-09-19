/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IStudent } from '@/types/studentTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Firebase возвращает объект вида { id1: StudentData, id2: StudentData, ... }
type StudentData = Omit<IStudent, 'id'>;
type UpdtUser = { id: string; data: Partial<IStudent> };

const rawBaseQuery = fetchBaseQuery({
  baseUrl:
    'https://tutor-crm-49cae-default-rtdb.europe-west1.firebasedatabase.app/',
});

const baseQueryWithAuth: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const token = (api.getState() as any).user.token;

  if (token) {
    if (typeof args === 'string') {
      args = `${args}${args.includes('?') ? '&' : '?'}auth=${token}`;
    } else if (args.url) {
      args.url = `${args.url}${args.url.includes('?') ? '&' : '?'}auth=${token}`;
    }
  }

  return rawBaseQuery(args, api, extraOptions);
};

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Students'],
  endpoints: (build) => ({
    getStudents: build.query<IStudent[], string | null>({
      query: (userId) => {
        return `students.json?orderBy="userId"&equalTo="${userId}"`;
      },
      transformResponse: (response: Record<string, StudentData> | null) =>
        response
          ? Object.entries(response).map(([id, value]) => ({
              id,
              ...value,
            }))
          : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Students' as const, id })),
              { type: 'Students', id: 'LIST' },
            ]
          : [{ type: 'Students', id: 'LIST' }],
    }),

    addStudent: build.mutation<IStudent, StudentData>({
      query: ({ name, age, userId, email }) => ({
        url: 'students.json',
        method: 'POST',
        body: { name, email, age, userId },
      }),
      invalidatesTags: [{ type: 'Students', id: 'LIST' }],
    }),

    updateStudent: build.mutation<IStudent, UpdtUser>({
      query: ({ id, data }) => ({
        url: `students/${id}.json`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Students', id },
        { type: 'Students', id: 'LIST' },
      ],
    }),

    deleteStudent: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `students/${id}.json`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
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
