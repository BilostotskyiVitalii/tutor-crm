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
import type { Student, StudentData, UpdateUser } from '@/types/studentTypes';
import { getCurrentUid } from '@/utils/getCurrentUid';

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
          const students: Student[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Student[];
          return { data: students };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      providesTags: ['Students'],
    }),

    addStudent: builder.mutation<void, StudentData>({
      async queryFn(newStudent) {
        try {
          const uid = getCurrentUid();
          await addDoc(collection(db, `users/${uid}/students`), newStudent);
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: ['Students'],
    }),

    updateStudent: builder.mutation<void, UpdateUser>({
      async queryFn({ id, data }) {
        try {
          const uid = getCurrentUid();
          await updateDoc(doc(db, `users/${uid}/students/${id}`), data);
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: ['Students'],
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
      invalidatesTags: ['Students'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
