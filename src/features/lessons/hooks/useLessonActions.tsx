import { useCallback } from 'react';

import { Modal, notification } from 'antd';

import {
  useAddLessonMutation,
  useDeleteLessonMutation,
  useUpdateLessonMutation,
} from '@/features/lessons/api/lessonsApi';
import type { LessonData } from '@/features/lessons/types/lessonTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

const { confirm } = Modal;

export function useLessonActions() {
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();
  const [addLesson] = useAddLessonMutation();
  const { handleError } = useErrorHandler();

  const createLesson = useCallback(
    async (data: LessonData) => {
      try {
        await addLesson(data).unwrap();
        notification.success({ message: 'Lesson created!' });
      } catch (err) {
        handleError(err, 'Failed to create lesson');
      }
    },
    [addLesson, handleError],
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
    [updateLesson, handleError],
  );

  const removeLesson = useCallback(
    (id: string) => {
      confirm({
        title: 'Delete this lesson?',
        okType: 'danger',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          try {
            await deleteLesson(id).unwrap();
            notification.success({ message: 'Lesson deleted!' });
          } catch (err) {
            handleError(err, 'Failed to delete lesson');
          }
        },
      });
    },
    [deleteLesson, handleError],
  );

  return {
    createLesson,
    updateLessonData,
    removeLesson,
    isDeleting,
  };
}
