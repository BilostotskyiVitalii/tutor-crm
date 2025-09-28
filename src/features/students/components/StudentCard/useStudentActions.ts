import { useCallback } from 'react';

import { notification } from 'antd';

import {
  useDeleteStudentMutation,
  useUpdateStudentMutation,
} from '@/features/students/api/studentsApi';
import type { StudentStatus } from '@/features/students/types/studentTypes';

export function useStudentActions(studentId: string) {
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();

  const removeStudent = useCallback(async () => {
    try {
      await deleteStudent(studentId).unwrap();
      notification.success({ message: 'Student deleted!' });
    } catch {
      notification.error({ message: 'Failed to delete student' });
    }
  }, [deleteStudent, studentId]);

  const updateStatus = useCallback(
    async (newStatus: StudentStatus) => {
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
    removeStudent,
    updateStatus,
    isDeleting,
  };
}
