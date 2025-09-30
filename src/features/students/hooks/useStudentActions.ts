import { useCallback } from 'react';

import { notification } from 'antd';

import {
  useAddStudentMutation,
  useDeleteStudentMutation,
  useUpdateStudentMutation,
} from '@/features/students/api/studentsApi';
import type {
  StudentData,
  StudentStatus,
} from '@/features/students/types/studentTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
export function useStudentActions() {
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [addStudent] = useAddStudentMutation();
  const { handleError } = useErrorHandler();

  const createStudent = useCallback(
    async (data: StudentData) => {
      try {
        await addStudent(data).unwrap();
        notification.success({ message: 'Student created!' });
      } catch (err) {
        handleError(err, 'Failed to create student');
      }
    },
    [addStudent, handleError],
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
    [updateStudent, handleError],
  );

  const removeStudent = useCallback(
    async (id: string) => {
      try {
        await deleteStudent(id).unwrap();
        notification.success({ message: 'Student deleted!' });
      } catch (err) {
        handleError(err, 'Failed to delete student');
      }
    },
    [deleteStudent, handleError],
  );

  const updateStudentStatus = useCallback(
    async ({ id, newStatus }: { id: string; newStatus: StudentStatus }) => {
      try {
        await updateStudent({
          id,
          data: { status: newStatus },
        }).unwrap();
        notification.success({ message: 'Status updated!' });
      } catch (err) {
        handleError(err, 'Failed to delete student status');
      }
    },
    [updateStudent, handleError],
  );

  return {
    createStudent,
    updateStudentData,
    removeStudent,
    updateStudentStatus,
    isDeleting,
  };
}
