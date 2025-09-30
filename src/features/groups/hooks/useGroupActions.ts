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

  return {
    createGroup,
    updateGroupData,
    removeGroup,
    isDeleting,
  };
}
