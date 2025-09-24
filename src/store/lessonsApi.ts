import { createApi } from '@reduxjs/toolkit/query/react';

import { apiURL } from '@/constants/apiUrl';
import type { RootState } from '@/store';
import { baseQueryWithAuth } from '@/store/baseQueryWithAuth';
import type { Lesson, LessonData, UpdateLesson } from '@/types/lessonTypes';

const { lessons } = apiURL;

export const lessonsApi = createApi({
  reducerPath: 'lessonsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Lessons'],
  endpoints: (builder) => ({
    getLessons: builder.query<Lesson[], string>({
      query: (uid) => `${lessons}/${uid}.json`,
      transformResponse: (response: Record<string, LessonData> | null) =>
        response
          ? Object.entries(response).map(([id, val]) => ({ id, ...val }))
          : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Lessons' as const, id })),
              { type: 'Lessons', id: 'LIST' },
            ]
          : [{ type: 'Lessons', id: 'LIST' }],
    }),

    addLesson: builder.mutation<Lesson, LessonData>({
      queryFn: async (data, api, _extraOptions, baseQuery) => {
        const uid = (api.getState() as RootState).user.id!;
        const result = await baseQuery({
          url: `${lessons}/${uid}.json`,
          method: 'POST',
          body: data,
        });

        if (result.error) {
          return { error: result.error };
        }

        const id = (result.data as { name: string }).name;
        return { data: { id, ...data } as Lesson };
      },
      invalidatesTags: [{ type: 'Lessons', id: 'LIST' }],
    }),

    updateLesson: builder.mutation<Lesson, UpdateLesson>({
      queryFn: async ({ id, data }, api, _extraOptions, baseQuery) => {
        const uid = (api.getState() as RootState).user.id!;
        const result = await baseQuery({
          url: `${lessons}/${uid}/${id}.json`,
          method: 'PATCH',
          body: data,
        });
        if (result.error) {
          return { error: result.error };
        }
        return { data: { id, ...data } as Lesson };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Lessons', id },
        { type: 'Lessons', id: 'LIST' },
      ],
    }),

    deleteLesson: builder.mutation<void, string>({
      queryFn: async (id, api, _extraOptions, baseQuery) => {
        const uid = (api.getState() as RootState).user.id!;
        const result = await baseQuery({
          url: `${lessons}/${uid}/${id}.json`,
          method: 'DELETE',
        });
        if (result.error) {
          return { error: result.error };
        }
        return { data: undefined };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Lessons', id },
        { type: 'Lessons', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useAddLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonsApi;
