import { useEffect, useState } from 'react';

import type { FormInstance } from 'antd';

import type { Group } from '@/features/groups/types/groupTypes';
import type {
  Lesson,
  LessonData,
  LessonFormValues,
} from '@/features/lessons/types/lessonTypes';
import {
  buildLessonData,
  initializeFormValues,
} from '@/features/lessons/utils/lessonFormUtils';
import type { Student } from '@/features/students/types/studentTypes';

interface UseLessonFormProps {
  form: FormInstance<LessonFormValues>;
  editedLessonId?: string | null;
  defaultStudent?: string | null;
  defaultGroup?: string | null;
  defaultStart?: Date | null;
  defaultEnd?: Date | null;
  students: Student[];
  lessons: Lesson[];
  groups: Group[];
  updateLessonData: (id: string, data: LessonData) => Promise<void>;
  createLesson: (data: LessonData) => Promise<void>;
  handleError: (err: unknown, context?: string) => void;
  onClose: () => void;
}

export const useLessonForm = ({
  form,
  editedLessonId,
  defaultStudent,
  defaultGroup,
  students,
  lessons,
  groups,
  updateLessonData,
  createLesson,
  handleError,
  onClose,
  defaultStart,
  defaultEnd,
}: UseLessonFormProps) => {
  const [isGroup, setIsGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialValues = initializeFormValues(
      lessons,
      students,
      groups,
      editedLessonId,
      defaultStudent,
      defaultGroup,
      defaultStart,
      defaultEnd,
    );

    form.setFieldsValue(initialValues.values);
    setIsGroup(initialValues.isGroup);
  }, [
    form,
    lessons,
    students,
    groups,
    editedLessonId,
    defaultStudent,
    defaultGroup,
    defaultStart,
    defaultEnd,
  ]);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const formValues = await form.validateFields();
      const lessonData = buildLessonData(
        formValues,
        students,
        lessons,
        editedLessonId,
      );

      if (editedLessonId) {
        await updateLessonData(editedLessonId, lessonData);
      } else {
        await createLesson(lessonData);
      }

      handleCancel();
    } catch (err) {
      handleError(err, 'Lesson form error');
    } finally {
      setIsLoading(false);
    }
  };

  return { isGroup, setIsGroup, isLoading, handleFinish, handleCancel };
};
