import { useCallback } from 'react';

import { App as AntApp } from 'antd';
import { serverTimestamp } from 'firebase/firestore';

import {
  useAddGroupMutation,
  useDeleteGroupMutation,
  useGetGroupsQuery,
  useUpdateGroupMutation,
} from '@/features/groups/api/groupsApi';
import type { GroupData } from '@/features/groups/types/groupTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export function useGroupActions() {
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();
  const [addGroup] = useAddGroupMutation();
  const { handleError } = useErrorHandler();
  const { data: groups = [] } = useGetGroupsQuery();
  const { notification, modal } = AntApp.useApp();

  const createGroup = useCallback(
    async (data: GroupData) => {
      try {
        await addGroup(data).unwrap();
        notification.success({ message: 'Group created!' });
      } catch (err) {
        handleError(err, 'Failed to create group');
      }
    },
    [addGroup, handleError, notification],
  );

  const updateGroupData = useCallback(
    async (id: string, data: GroupData) => {
      try {
        await updateGroup({ id, data }).unwrap();
        notification.success({ message: 'Group updated!' });
      } catch (err) {
        handleError(err, 'Failed to update group');
      }
    },
    [updateGroup, handleError, notification],
  );

  const removeGroup = useCallback(
    async (id: string) => {
      modal.confirm({
        title: 'Delete this group?',
        okType: 'danger',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          try {
            await deleteGroup(id).unwrap();
            notification.success({ message: 'Group deleted!' });
          } catch (err) {
            handleError(err, 'Failed to delete group');
          }
        },
      });
    },
    [deleteGroup, handleError, notification, modal],
  );

  const removeStudentFromGroups = useCallback(
    async (studentId: string) => {
      try {
        const updatePromises = groups
          .map((group) => {
            if (group.studentIds?.includes(studentId)) {
              return updateGroup({
                id: group.id,
                data: {
                  studentIds: group.studentIds.filter((id) => id !== studentId),
                  updatedAt: serverTimestamp(),
                },
              }).unwrap();
            }
          })
          .filter(Boolean) as Promise<unknown>[];

        await Promise.all(updatePromises);
        if (updatePromises.length !== 0) {
          notification.success({
            message: 'Student removed from all groups!',
          });
        }
      } catch (err) {
        handleError(err, 'Failed to remove student from groups');
      }
    },
    [updateGroup, handleError, groups, notification],
  );

  return {
    createGroup,
    updateGroupData,
    removeGroup,
    removeStudentFromGroups,
    isDeleting,
  };
}
