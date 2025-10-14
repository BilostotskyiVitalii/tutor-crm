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
  Group,
  GroupData,
  UpdateGroup,
} from '@/features/groups/types/groupTypes';
import { mapFirestoreGroup } from '@/features/groups/utils/mapFirestoreGroup';
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

          const groupsData: Group[] = snapshot.docs.map((docSnap) =>
            mapFirestoreGroup(docSnap.id, docSnap.data()),
          );

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

    getGroupById: builder.query<Group | null, string>({
      async queryFn(id) {
        try {
          const uid = getCurrentUid();
          const docRef = doc(db, `${users}/${uid}/${groups}/${id}`);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            return { data: null };
          }

          const data = docSnap.data();

          return { data: mapFirestoreGroup(docSnap.id, data) };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Groups', id }],
    }),

    addGroup: builder.mutation<void, GroupData>({
      async queryFn(newGroup) {
        try {
          const uid = getCurrentUid();
          await addDoc(collection(db, `${users}/${uid}/${groups}`), newGroup);
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
          await updateDoc(doc(db, `${users}/${uid}/${groups}/${id}`), data);
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
  useGetGroupByIdQuery,
  useAddGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupsApi;
