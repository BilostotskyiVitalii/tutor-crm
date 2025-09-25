import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/firebase';
import type { Lesson, LessonData, UpdateLesson } from '@/types/lessonTypes';
import { getCurrentUid } from '@/utils/getCurrentUid';

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
          const lessons: Lesson[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Lesson[];
          return { data: lessons };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      providesTags: ['Lessons'],
    }),

    addLesson: builder.mutation<void, LessonData>({
      async queryFn(newLesson) {
        try {
          const uid = getCurrentUid();
          await addDoc(collection(db, `users/${uid}/lessons`), newLesson);
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: ['Lessons'],
    }),

    updateLesson: builder.mutation<void, UpdateLesson>({
      async queryFn({ id, data }) {
        try {
          const uid = getCurrentUid();
          await updateDoc(doc(db, `users/${uid}/lessons/${id}`), data);
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: ['Lessons'],
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
      invalidatesTags: ['Lessons'],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useAddLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonsApi;
