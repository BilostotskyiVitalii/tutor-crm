import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/app/firebase';
import type {
  Lesson,
  LessonData,
  UpdateLesson,
} from '@/features/lessons/types/lessonTypes';
import { mapFirestoreLesson } from '@/features/lessons/utils/mapFirestoreLesson';
import { endpointsURL } from '@/shared/constants/endpointsUrl';
import { getCurrentUid } from '@/shared/utils/getCurrentUid';

const { lessons, users } = endpointsURL;

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
            collection(db, `${users}/${uid}/${lessons}`),
          );

          const lessonsData: Lesson[] = snapshot.docs.map((docSnap) =>
            mapFirestoreLesson(docSnap.id, docSnap.data()),
          );

          return { data: lessonsData };
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

    getLessonById: builder.query<Lesson | null, string>({
      async queryFn(id) {
        try {
          const uid = getCurrentUid();
          const docRef = doc(db, `${users}/${uid}/${lessons}/${id}`);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            return { data: null };
          }

          return { data: mapFirestoreLesson(docSnap.id, docSnap.data()) };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Lessons', id }],
    }),

    addLesson: builder.mutation<void, LessonData>({
      async queryFn(newLesson) {
        try {
          const uid = getCurrentUid();
          await addDoc(collection(db, `${users}/${uid}/${lessons}`), newLesson);
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
          await updateDoc(doc(db, `${users}/${uid}/${lessons}/${id}`), data);
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
          await deleteDoc(doc(db, `${users}/${uid}/${lessons}/${id}`));
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
  useGetLessonByIdQuery,
  useAddLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonsApi;
