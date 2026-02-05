import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const createLesson = useCallback(
    async (data: LessonData) => {
      try {
        await addLesson(data).unwrap();
        notification.success({
          message: `${t('useLessonAction.created')}`,
        });
      } catch (err) {
        handleError(err, `${t('useLessonAction.createFailed')}`);
      }
    },
    [addLesson, handleError, notification, t],
  );

  const updateLessonData = useCallback(
    async (id: string, data: Partial<LessonData>) => {
      try {
        await updateLesson({ id, data }).unwrap();
        notification.success({ message: `${t('useLessonAction.updated')}` });
      } catch (err) {
        handleError(err, `${t('useLessonAction.updateFailed')}`);
      }
    },
    [updateLesson, handleError, notification, t],
  );

  const removeLesson = useCallback(
    async (id: string) => {
      try {
        await deleteLesson(id).unwrap();
        notification.success({ message: `${t('useLessonAction.deleted')}` });
      } catch (err) {
        handleError(err, `${t('useLessonAction.deleteFailed')}`);
      }
    },
    [deleteLesson, handleError, notification, t],
  );

  return {
    createLesson,
    updateLessonData,
    removeLesson,
    isDeleting,
  };
}
