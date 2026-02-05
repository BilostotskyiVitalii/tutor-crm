import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { App as AntApp } from 'antd';

import { useGroupActions } from '@/features/groups/hooks/useGroupActions';
import {
  useAddStudentMutation,
  useDeleteStudentMutation,
  useUpdateStudentMutation,
} from '@/features/students/api/studentsApi';
import type { StudentData } from '@/features/students/types/studentTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export function useStudentActions() {
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [addStudent] = useAddStudentMutation();
  const { removeStudentFromGroups } = useGroupActions();
  const { handleError } = useErrorHandler();
  const { notification, modal } = AntApp.useApp();
  const { t } = useTranslation();

  const createStudent = useCallback(
    async (data: StudentData) => {
      try {
        await addStudent(data).unwrap();
        notification.success({
          message: `${t('useStudentAction.created')}`,
        });
      } catch (err) {
        handleError(err, `${t('useStudentAction.createFailed')}`);
      }
    },
    [addStudent, handleError, notification, t],
  );

  const updateStudentData = useCallback(
    async (id: string, data: Partial<StudentData>) => {
      try {
        await updateStudent({ id, data }).unwrap();
        notification.success({ message: `${t('useStudentAction.updated')}` });
      } catch (err) {
        handleError(err, `${t('useStudentAction.updateFailed')}`);
      }
    },
    [updateStudent, handleError, notification, t],
  );

  const removeStudent = useCallback(
    async (id: string) => {
      modal.confirm({
        title: `${t('useStudentAction.deleteConfirm')}`,
        okType: 'danger',
        okText: `${t('okText')}`,
        cancelText: `${t('cancelText')}`,
        onOk: async () => {
          try {
            await removeStudentFromGroups(id);
            await deleteStudent(id).unwrap();
            notification.success({
              message: `${t('useStudentAction.deleted')}`,
            });
          } catch (err) {
            handleError(err, `${t('useStudentAction.deleteFailed')}`);
          }
        },
      });
    },
    [
      deleteStudent,
      handleError,
      removeStudentFromGroups,
      modal,
      notification,
      t,
    ],
  );

  const updateStudentStatus = useCallback(
    async ({ id, newStatus }: { id: string; newStatus: boolean }) => {
      try {
        await removeStudentFromGroups(id);
        await updateStudent({
          id,
          data: { isActive: newStatus },
        }).unwrap();
        notification.success({
          message: `${t('useStudentAction.updatedStatus')}`,
        });
      } catch (err) {
        handleError(err, `${t('useStudentAction.updateStatusFailed')}`);
      }
    },
    [updateStudent, handleError, removeStudentFromGroups, notification, t],
  );

  return {
    createStudent,
    updateStudentData,
    removeStudent,
    updateStudentStatus,
    isDeleting,
  };
}
