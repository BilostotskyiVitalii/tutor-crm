import { apiURL } from '@/constants/apiUrl';
import type { RootState } from '@/store';
import type {
  IStudent,
  StudentData,
  IStudentFormValues,
  IUpdtUser,
} from '@/types/studentTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const { base, students } = apiURL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: base,
});

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
    // добавляем токен
    newArgs = `${args}${args.includes('?') ? '&' : '?'}auth=${token}`;
    // если это getStudents, добавляем userId
    if (args.includes('students.json') && args.includes('orderBy')) {
      newArgs += `&equalTo="${userId}"`;
    }
  } else if ('url' in args) {
    newArgs = {
      ...args,
      url: `${args.url}${args.url.includes('?') ? '&' : '?'}auth=${token}`,
    };

    // если это getStudents, добавляем userId
    if (args.url.includes('students.json') && args.url.includes('orderBy')) {
      newArgs.url += `&equalTo="${userId}"`;
    }

    // для POST-запросов добавляем userId в тело
    if (args.method === 'POST' && args.body) {
      newArgs.body = { ...args.body, userId };
    }
  }

  return rawBaseQuery(newArgs, api, extraOptions);
};

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Students'],
  endpoints: (build) => ({
    getStudents: build.query<IStudent[], void>({
      query: () => `${students}.json?orderBy="userId"`, // userId подставится автоматически
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

    addStudent: build.mutation<IStudent, IStudentFormValues>({
      query: (student) => ({
        url: `${students}.json`,
        method: 'POST',
        body: student, // userId добавится автоматически
      }),
      invalidatesTags: [{ type: 'Students', id: 'LIST' }],
    }),

    updateStudent: build.mutation<IStudent, IUpdtUser>({
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
