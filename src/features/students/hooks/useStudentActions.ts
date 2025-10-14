import { useCallback } from 'react';

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

  const createStudent = useCallback(
    async (data: StudentData) => {
      try {
        await addStudent(data).unwrap();
        notification.success({ message: 'Student created!' });
      } catch (err) {
        handleError(err, 'Failed to create student');
      }
    },
    [addStudent, handleError, notification],
  );

  const updateStudentData = useCallback(
    async (id: string, data: StudentData) => {
      try {
        await updateStudent({ id, data }).unwrap();
        notification.success({ message: 'Student updated!' });
      } catch (err) {
        handleError(err, 'Failed to update student');
      }
    },
    [updateStudent, handleError, notification],
  );

  const removeStudent = useCallback(
    async (id: string) => {
      modal.confirm({
        title: 'Delete this student?',
        okType: 'danger',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          try {
            await removeStudentFromGroups(id);
            await deleteStudent(id).unwrap();
            notification.success({ message: 'Student deleted!' });
          } catch (err) {
            handleError(err, 'Failed to delete student');
          }
        },
      });
    },
    [deleteStudent, handleError, removeStudentFromGroups, modal, notification],
  );

  const updateStudentStatus = useCallback(
    async ({ id, newStatus }: { id: string; newStatus: boolean }) => {
      try {
        await removeStudentFromGroups(id);
        await updateStudent({
          id,
          data: { isActive: newStatus },
        }).unwrap();
        notification.success({ message: 'Status updated!' });
      } catch (err) {
        handleError(err, 'Failed to delete student status');
      }
    },
    [updateStudent, handleError, removeStudentFromGroups, notification],
  );

  return {
    createStudent,
    updateStudentData,
    removeStudent,
    updateStudentStatus,
    isDeleting,
  };
}
