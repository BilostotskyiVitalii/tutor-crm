import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { App as AntApp } from 'antd';

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
  const { t } = useTranslation();

  const createGroup = useCallback(
    async (data: GroupData) => {
      try {
        await addGroup(data).unwrap();
        notification.success({ message: `${t('useGroupActions.created')}` });
      } catch (err) {
        handleError(err, `${t('useGroupActions.createFailed')}`);
      }
    },
    [addGroup, handleError, notification, t],
  );

  const updateGroupData = useCallback(
    async (id: string, data: Partial<GroupData>) => {
      try {
        await updateGroup({ id, data }).unwrap();
        notification.success({
          message: `${t('useGroupActions.updated')}`,
        });
      } catch (err) {
        handleError(err, `${t('useGroupActions.updateFailed')}`);
      }
    },
    [updateGroup, handleError, notification, t],
  );

  const removeGroup = useCallback(
    async (id: string) => {
      modal.confirm({
        title: `${t('useGroupActions.deleteConfirm')}`,
        okType: 'danger',
        okText: `${t('okText')}`,
        cancelText: `${t('cancelText')}`,
        onOk: async () => {
          try {
            await deleteGroup(id).unwrap();
            notification.success({
              message: `${t('useGroupActions.deleted')}`,
            });
          } catch (err) {
            handleError(err, `${t('useGroupActions.deleteFailed')}`);
          }
        },
      });
    },
    [deleteGroup, handleError, notification, modal, t],
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
                },
              }).unwrap();
            }
          })
          .filter(Boolean) as Promise<unknown>[];

        await Promise.all(updatePromises);
        if (updatePromises.length !== 0) {
          notification.success({
            message: `${t('useGroupActions.removed')}`,
          });
        }
      } catch (err) {
        handleError(err, `${t('useGroupActions.reemoveFailed')}`);
      }
    },
    [updateGroup, handleError, groups, notification, t],
  );

  return {
    createGroup,
    updateGroupData,
    removeGroup,
    removeStudentFromGroups,
    isDeleting,
  };
}
