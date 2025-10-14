import { useCallback } from 'react';

import { App as AntApp } from 'antd';

import {
  useAddLessonMutation,
  useDeleteLessonMutation,
  useUpdateLessonMutation,
} from '@/features/lessons/api/lessonsApi';
import type { LessonData } from '@/features/lessons/types/lessonTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export function useLessonActions() {
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();
  const [addLesson] = useAddLessonMutation();
  const { handleError } = useErrorHandler();
  const { notification } = AntApp.useApp();

  const createLesson = useCallback(
    async (data: LessonData) => {
      try {
        await addLesson(data).unwrap();
        notification.success({ message: 'Lesson created!' });
      } catch (err) {
        handleError(err, 'Failed to create lesson');
      }
    },
    [addLesson, handleError, notification],
  );

  const updateLessonData = useCallback(
    async (id: string, data: Partial<LessonData>) => {
      try {
        await updateLesson({ id, data }).unwrap();
        notification.success({ message: 'Lesson updated!' });
      } catch (err) {
        handleError(err, 'Failed to update lesson');
      }
    },
    [updateLesson, handleError, notification],
  );

  const removeLesson = useCallback(
    async (id: string) => {
      try {
        await deleteLesson(id).unwrap();
        notification.success({ message: 'Lesson deleted!' });
      } catch (err) {
        handleError(err, 'Failed to delete lesson');
      }
    },
    [deleteLesson, handleError, notification],
  );

  return {
    createLesson,
    updateLessonData,
    removeLesson,
    isDeleting,
  };
}
