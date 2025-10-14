import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/app/firebase';
import type {
  Student,
  StudentData,
  UpdateUser,
} from '@/features/students/types/studentTypes';
import { endpointsURL } from '@/shared/constants/endpointsUrl';
import { getCurrentUid } from '@/shared/utils/getCurrentUid';

const { students, users } = endpointsURL;

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
            collection(db, `${users}/${uid}/${students}`),
          );

          const studentsData: Student[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
              birthdate: (data.birthdate as Timestamp)?.toMillis?.() ?? null,
              createdAt: (data.createdAt as Timestamp)?.toMillis?.(),
              updatedAt: (data.updatedAt as Timestamp)?.toMillis?.(),
            };
          }) as Student[];

          return { data: studentsData };
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

    getStudentById: builder.query<Student | null, string>({
      async queryFn(id) {
        try {
          const uid = getCurrentUid();
          const docRef = doc(db, `${users}/${uid}/${students}/${id}`);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            return { data: null };
          }

          const data = docSnap.data();

          const student: Student = {
            id: docSnap.id,
            name: data.name ?? '',
            email: data.email ?? '',
            phone: data.phone ?? null,
            contact: data.contact ?? null,
            birthdate: (data.birthdate as Timestamp)?.toMillis?.() ?? null,
            currentLevel: data.currentLevel ?? '',
            price: data.price ?? 0,
            notes: data.notes ?? null,
            avatarUrl: data.avatarUrl ?? undefined,
            isActive: data.isActive ?? true,
            createdAt:
              (data.createdAt as Timestamp)?.toMillis?.() ?? Date.now(),
            updatedAt:
              (data.updatedAt as Timestamp)?.toMillis?.() ?? Date.now(),
          };

          return { data: student };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Students', id }],
    }),

    addStudent: builder.mutation<void, StudentData>({
      async queryFn(newStudent) {
        try {
          const uid = getCurrentUid();
          await addDoc(
            collection(db, `${users}/${uid}/${students}`),
            newStudent,
          );
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
          await updateDoc(doc(db, `${users}/${uid}/${students}/${id}`), data);
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
          await deleteDoc(doc(db, `${users}/${uid}/${students}/${id}`));
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
  useGetStudentByIdQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
