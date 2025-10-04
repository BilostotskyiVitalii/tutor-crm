import { useCallback } from 'react';

import { notification } from 'antd';

import {
  useAddGroupMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} from '@/features/groups/api/groupsApi';
import type { GroupData } from '@/features/groups/types/groupTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export function useGroupActions() {
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();
  const [addGroup] = useAddGroupMutation();
  const { handleError } = useErrorHandler();

  const createGroup = useCallback(
    async (data: GroupData) => {
      try {
        await addGroup(data).unwrap();
        notification.success({ message: 'Group created!' });
      } catch (err) {
        handleError(err, 'Failed to create group');
      }
    },
    [addGroup, handleError],
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
    [updateGroup, handleError],
  );

  const removeGroup = useCallback(
    async (id: string) => {
      try {
        await deleteGroup(id).unwrap();
        notification.success({ message: 'Group deleted!' });
      } catch (err) {
        handleError(err, 'Failed to delete group');
      }
    },
    [deleteGroup, handleError],
  );

  const removeStudentFromGroups = useCallback(
    async (
      studentId: string,
      allGroups: { id: string; studentIds?: string[] }[],
    ) => {
      try {
        const updatePromises = allGroups
          .map((group) => {
            if (group.studentIds?.includes(studentId)) {
              return updateGroup({
                id: group.id,
                data: {
                  ...group,
                  studentIds: group.studentIds.filter((id) => id !== studentId),
                },
              }).unwrap();
            }
          })
          .filter(Boolean) as Promise<unknown>[];

        await Promise.all(updatePromises);
        if (updatePromises.length !== 0) {
          notification.success({ message: 'Student removed from all groups!' });
        }
      } catch (err) {
        handleError(err, 'Failed to remove student from groups');
      }
    },
    [updateGroup, handleError],
  );

  return {
    createGroup,
    updateGroupData,
    removeGroup,
    removeStudentFromGroups,
    isDeleting,
  };
}
