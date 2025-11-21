import { useCallback } from 'react';

import { App as AntApp } from 'antd';

import { useUpdateUserMutation } from '@/features/user/api/userApi';
import type { UserUpdates } from '@/features/user/types/userTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export function useUserActions() {
  // const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [updateUser] = useUpdateUserMutation();
  const { handleError } = useErrorHandler();
  const { notification, modal } = AntApp.useApp();

  const updateUserData = useCallback(
    async (data: Partial<UserUpdates>) => {
      try {
        await updateUser(data).unwrap();
        notification.success({ message: 'User updated!' });
      } catch (err) {
        handleError(err, 'Failed to update user');
      }
    },
    [updateUser, handleError, notification],
  );

  // const removeStudent = useCallback(
  //   async (id: string) => {
  //     modal.confirm({
  //       title: 'Delete this student?',
  //       okType: 'danger',
  //       okText: 'Yes',
  //       cancelText: 'No',
  //       onOk: async () => {
  //         try {
  //           await removeStudentFromGroups(id);
  //           await deleteStudent(id).unwrap();
  //           notification.success({ message: 'Student deleted!' });
  //         } catch (err) {
  //           handleError(err, 'Failed to delete student');
  //         }
  //       },
  //     });
  //   },
  //   [deleteStudent, handleError, removeStudentFromGroups, modal, notification],
  // );

  return {
    updateUserData,
  };
}
