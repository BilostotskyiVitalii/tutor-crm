import { createApi } from '@reduxjs/toolkit/query/react';

import type {
  Lesson,
  LessonData,
  UpdateLesson,
} from '@/features/lessons/types/lessonTypes';
import { baseQueryWithAuth } from '@/shared/api/baseQueryWithAuth';
import { endpointsURL } from '@/shared/constants/endpointsUrl';

const { lessons } = endpointsURL;

export const lessonsApi = createApi({
  reducerPath: 'lessonsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Lessons'],
  endpoints: (builder) => ({
    getLessons: builder.query<Lesson[], void>({
      query: () => ({ url: lessons, method: 'GET' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Lessons' as const, id })),
              { type: 'Lessons', id: 'LIST' },
            ]
          : [{ type: 'Lessons', id: 'LIST' }],
    }),

    getLessonById: builder.query<Lesson | null, string>({
      query: (id) => ({ url: `${lessons}/${id}`, method: 'GET' }),
      providesTags: (_r, _e, id) => [{ type: 'Lessons', id }],
    }),

    addLesson: builder.mutation<Lesson, LessonData>({
      query: (newLesson) => ({ url: lessons, method: 'POST', body: newLesson }),
      invalidatesTags: [{ type: 'Lessons', id: 'LIST' }],
    }),

    updateLesson: builder.mutation<Lesson, UpdateLesson>({
      query: ({ id, data }) => ({
        url: `${lessons}/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Lessons', id }],
    }),

    deleteLesson: builder.mutation<void, string>({
      query: (id) => ({ url: `${lessons}/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Lessons', id }],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useGetLessonByIdQuery,
  useAddLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonsApi;
