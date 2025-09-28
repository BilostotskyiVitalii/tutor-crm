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

export function useStudentActions(studentId?: string) {
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [addStudent] = useAddStudentMutation();

  const createStudent = useCallback(
    async (data: StudentData) => {
      try {
        await addStudent(data).unwrap();
        notification.success({ message: 'Student created!' });
      } catch {
        notification.error({ message: 'Failed to create student' });
      }
    },
    [addStudent],
  );

  const updateStudentData = useCallback(
    async (data: StudentData) => {
      if (!studentId) {
        return;
      }
      try {
        await updateStudent({ id: studentId, data }).unwrap();
        notification.success({ message: 'Student updated!' });
      } catch {
        notification.error({ message: 'Failed to update student' });
      }
    },
    [updateStudent, studentId],
  );

  const removeStudent = useCallback(async () => {
    if (!studentId) {
      return;
    }
    try {
      await deleteStudent(studentId).unwrap();
      notification.success({ message: 'Student deleted!' });
    } catch {
      notification.error({ message: 'Failed to delete student' });
    }
  }, [deleteStudent, studentId]);

  const updateStudentStatus = useCallback(
    async (newStatus: StudentStatus) => {
      if (!studentId) {
        return;
      }
      try {
        await updateStudent({
          id: studentId,
          data: { status: newStatus },
        }).unwrap();
        notification.success({ message: 'Status updated!' });
      } catch {
        notification.error({ message: 'Failed to update status' });
      }
    },
    [updateStudent, studentId],
  );

  return {
    createStudent,
    updateStudentData,
    removeStudent,
    updateStudentStatus,
    isDeleting,
  };
}
