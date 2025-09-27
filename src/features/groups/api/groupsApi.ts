import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import type {
  Group,
  GroupData,
  UpdateGroup,
} from '@/features/groups/types/groupTypes';
import { db } from '@/firebase';
import { getCurrentUid } from '@/shared/utils/getCurrentUid';

export const groupsApi = createApi({
  reducerPath: 'groupsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Groups'],
  endpoints: (builder) => ({
    getGroups: builder.query<Group[], void>({
      async queryFn() {
        try {
          const uid = getCurrentUid();
          const snapshot = await getDocs(collection(db, `users/${uid}/groups`));
          const groups: Group[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Group[];
          return { data: groups };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      providesTags: ['Groups'],
    }),

    addGroup: builder.mutation<void, GroupData>({
      async queryFn(newGroup) {
        try {
          const uid = getCurrentUid();
          await addDoc(collection(db, `users/${uid}/groups`), newGroup);
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: ['Groups'],
    }),

    updateGroup: builder.mutation<void, UpdateGroup>({
      async queryFn({ id, data }) {
        try {
          const uid = getCurrentUid();
          await updateDoc(doc(db, `users/${uid}/groups/${id}`), data);
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: ['Groups'],
    }),

    deleteGroup: builder.mutation<void, string>({
      async queryFn(id) {
        try {
          const uid = getCurrentUid();
          await deleteDoc(doc(db, `users/${uid}/groups/${id}`));
          return { data: undefined };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: ['Groups'],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useAddGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupsApi;
