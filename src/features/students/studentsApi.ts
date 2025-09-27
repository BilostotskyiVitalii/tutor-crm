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
  Student,
  StudentData,
  UpdateUser,
} from '@/features/students/studentTypes';
import { db } from '@/firebase';
import { getCurrentUid } from '@/shared/utils/getCurrentUid';

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Students'],
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      async queryFn() {
        try {
          const uid = getCurrentUid();
          const snapshot = await getDocs(
            collection(db, `users/${uid}/students`),
          );

          const students: Student[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
              createdAt: (data.createdAt as Timestamp)?.toMillis?.() ?? 0,
              updatedAt: (data.updatedAt as Timestamp)?.toMillis?.() ?? 0,
            };
          }) as Student[];

          return { data: students };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Students' as const, id })),
              { type: 'Students', id: 'LIST' },
            ]
          : [{ type: 'Students', id: 'LIST' }],
    }),

    addStudent: builder.mutation<void, StudentData>({
      async queryFn(newStudent) {
        try {
          const uid = getCurrentUid();
          await addDoc(collection(db, `users/${uid}/students`), {
            ...newStudent,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: [{ type: 'Students', id: 'LIST' }],
    }),

    updateStudent: builder.mutation<void, UpdateUser>({
      async queryFn({ id, data }) {
        try {
          const uid = getCurrentUid();
          await updateDoc(doc(db, `users/${uid}/students/${id}`), {
            ...data,
            updatedAt: serverTimestamp(),
          });
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Students', id }],
    }),

    deleteStudent: builder.mutation<void, string>({
      async queryFn(id) {
        try {
          const uid = getCurrentUid();
          await deleteDoc(doc(db, `users/${uid}/students/${id}`));
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, id) => [{ type: 'Students', id }],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
