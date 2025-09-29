import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';

import type {
  Lesson,
  LessonData,
  UpdateLesson,
} from '@/features/lessons/types/lessonTypes';
import { db } from '@/firebase';
import { getCurrentUid } from '@/shared/utils/getCurrentUid';

export const lessonsApi = createApi({
  reducerPath: 'lessonsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Lessons'],
  endpoints: (builder) => ({
    getLessons: builder.query<Lesson[], void>({
      async queryFn() {
        try {
          const uid = getCurrentUid();
          const snapshot = await getDocs(
            collection(db, `users/${uid}/lessons`),
          );
          const lessons: Lesson[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
              start: (data.start as Timestamp)?.toMillis?.(),
              end: (data.end as Timestamp)?.toMillis?.(),
              createdAt: (data.createdAt as Timestamp)?.toMillis?.(),
              updatedAt: (data.updatedAt as Timestamp)?.toMillis?.(),
            };
          }) as Lesson[];
          return { data: lessons };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Lessons' as const, id })),
              { type: 'Lessons', id: 'LIST' },
            ]
          : [{ type: 'Lessons', id: 'LIST' }],
    }),

    addLesson: builder.mutation<void, LessonData>({
      async queryFn(newLesson) {
        try {
          const uid = getCurrentUid();
          await addDoc(collection(db, `users/${uid}/lessons`), {
            ...newLesson,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: [{ type: 'Lessons', id: 'LIST' }],
    }),

    updateLesson: builder.mutation<void, UpdateLesson>({
      async queryFn({ id, data }) {
        try {
          const uid = getCurrentUid();
          await updateDoc(doc(db, `users/${uid}/lessons/${id}`), {
            ...data,
            updatedAt: serverTimestamp(),
          });
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Lessons', id }],
    }),

    deleteLesson: builder.mutation<void, string>({
      async queryFn(id) {
        try {
          const uid = getCurrentUid();
          await deleteDoc(doc(db, `users/${uid}/lessons/${id}`));
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, id) => [{ type: 'Lessons', id }],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useAddLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonsApi;
