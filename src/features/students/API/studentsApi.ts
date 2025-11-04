import { createApi } from '@reduxjs/toolkit/query/react';

import type {
  Student,
  StudentData,
  StudentStats,
  UpdateUser,
} from '@/features/students/types/studentTypes';
import { baseQueryWithAuth } from '@/shared/api/baseQueryWithAuth';
import { endpointsURL } from '@/shared/constants/endpointsUrl';

const { students } = endpointsURL;

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Students', 'StudentStats'],
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      query: () => ({ url: students, method: 'GET' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Students' as const, id })),
              { type: 'Students', id: 'LIST' },
            ]
          : [{ type: 'Students', id: 'LIST' }],
    }),

    getStudentById: builder.query<Student | null, string>({
      query: (id) => ({ url: `${students}/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'Students', id }],
    }),

    addStudent: builder.mutation<Student, StudentData>({
      query: (newStudent) => ({
        url: students,
        method: 'POST',
        body: newStudent,
      }),
      invalidatesTags: [{ type: 'Students', id: 'LIST' }],
    }),

    updateStudent: builder.mutation<Student, UpdateUser>({
      query: ({ id, data }) => ({
        url: `${students}/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Students', id }],
    }),

    deleteStudent: builder.mutation<void, string>({
      query: (id) => ({ url: `${students}/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Students', id }],
    }),

    getStudentStats: builder.query<
      StudentStats,
      { id: string; start?: string; end?: string }
    >({
      query: ({ id, start, end }) => {
        const params = new URLSearchParams();
        if (start) {
          params.append('start', start);
        }
        if (end) {
          params.append('end', end);
        }
        return `students/${id}/stats?${params.toString()}`;
      },
      providesTags: ['StudentStats'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentStatsQuery,
} = studentsApi;
