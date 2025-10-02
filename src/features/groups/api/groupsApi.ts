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
  Group,
  GroupData,
  UpdateGroup,
} from '@/features/groups/types/groupTypes';
import { db } from '@/firebase';
import { endpointsURL } from '@/shared/constants/endpointsUrl';
import { getCurrentUid } from '@/shared/utils/getCurrentUid';

const { groups, users } = endpointsURL;

export const groupsApi = createApi({
  reducerPath: 'groupsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Groups'],
  endpoints: (builder) => ({
    getGroups: builder.query<Group[], void>({
      async queryFn() {
        try {
          const uid = getCurrentUid();
          const snapshot = await getDocs(
            collection(db, `${users}/${uid}/${groups}`),
          );
          const groupsData: Group[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
              createdAt: (data.createdAt as Timestamp)?.toMillis?.() ?? 0,
              updatedAt: (data.updatedAt as Timestamp)?.toMillis?.() ?? 0,
            };
          }) as Group[];
          return { data: groupsData };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Groups' as const, id })),
              { type: 'Groups', id: 'LIST' },
            ]
          : [{ type: 'Groups', id: 'LIST' }],
    }),

    addGroup: builder.mutation<void, GroupData>({
      async queryFn(newGroup) {
        try {
          const uid = getCurrentUid();
          await addDoc(collection(db, `${users}/${uid}/${groups}`), {
            ...newGroup,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: [{ type: 'Groups', id: 'LIST' }],
    }),

    updateGroup: builder.mutation<void, UpdateGroup>({
      async queryFn({ id, data }) {
        try {
          const uid = getCurrentUid();
          await updateDoc(doc(db, `${users}/${uid}/${groups}/${id}`), {
            ...data,
            updatedAt: serverTimestamp(),
          });
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Groups', id }],
    }),

    deleteGroup: builder.mutation<void, string>({
      async queryFn(id) {
        try {
          const uid = getCurrentUid();
          await deleteDoc(doc(db, `${users}/${uid}/${groups}/${id}`));
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, id) => [{ type: 'Groups', id }],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useAddGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupsApi;
