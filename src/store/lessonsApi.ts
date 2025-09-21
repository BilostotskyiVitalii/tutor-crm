import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import type {
  Lesson,
  LessonData,
  LessonFormValues,
  UpdateLesson,
} from '@/types/lessonTypes';
import { apiURL } from '@/constants/apiUrl';

const { base, lessons } = apiURL;

const rawBaseQuery = fetchBaseQuery({ baseUrl: base });

const baseQueryWithAuth: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const state = api.getState() as RootState;
  const token = state.user.token;
  const tutorId = state.user.id;

  let newArgs = args;

  if (!token) {
    return rawBaseQuery(args, api, extraOptions);
  }

  if (typeof args === 'string') {
    newArgs = `${args}${args.includes('?') ? '&' : '?'}auth=${token}`;
  } else if ('url' in args) {
    newArgs = {
      ...args,
      url: `${args.url}${args.url.includes('?') ? '&' : '?'}auth=${token}`,
    };

    // Для POST автоматически добавляем tutorId
    if (args.method === 'POST' && args.body) {
      newArgs.body = { ...args.body, tutorId: tutorId };
    }
  }

  return rawBaseQuery(newArgs, api, extraOptions);
};

export const lessonsApi = createApi({
  reducerPath: 'lessonsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Lessons'],
  endpoints: (builder) => ({
    getLessons: builder.query<Lesson[], string | void>({
      query: (tutorId) =>
        `${lessons}.json?orderBy="tutorId"&equalTo="${tutorId}"`,
      transformResponse: (response: Record<string, LessonData> | null) =>
        response
          ? Object.entries(response).map(([key, lesson]) => ({
              id: key,
              ...lesson,
            }))
          : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Lessons' as const, id })),
              { type: 'Lessons', id: 'LIST' },
            ]
          : [{ type: 'Lessons', id: 'LIST' }],
    }),

    getLesson: builder.query<Lesson, string>({
      query: (id) => `${lessons}/${id}.json`,
      providesTags: (_result, _error, id) => [{ type: 'Lessons', id }],
    }),

    createLesson: builder.mutation<Lesson, LessonFormValues>({
      query: (lesson) => ({
        url: `${lessons}.json`,
        method: 'POST',
        body: lesson, // tutorId автоматически подставляется в baseQuery
      }),
      invalidatesTags: ['Lessons'],
    }),

    updateLesson: builder.mutation<Lesson, UpdateLesson>({
      query: ({ id, data }) => ({
        url: `${lessons}/${id}.json`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Lessons', id }],
    }),

    deleteLesson: builder.mutation<void, string>({
      query: (id) => ({
        url: `${lessons}/${id}.json`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lessons'],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useGetLessonQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonsApi;
