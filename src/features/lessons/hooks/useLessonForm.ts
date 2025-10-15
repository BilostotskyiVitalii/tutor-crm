import { useCallback, useEffect, useState } from 'react';

import { App as AntApp, Form } from 'antd';
import dayjs from 'dayjs';

import { useGetGroupByIdQuery } from '@/features/groups/api/groupsApi';
import { useGetLessonByIdQuery } from '@/features/lessons/api/lessonsApi';
import { useBuildLessonData } from '@/features/lessons/hooks/useBuildLessonData';
import { useLessonActions } from '@/features/lessons/hooks/useLessonActions';
import type { LessonFormValues } from '@/features/lessons/types/lessonTypes';
import { useGetStudentByIdQuery } from '@/features/students/api/studentsApi';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import type { initDataType } from '@/shared/types/modalTypes';

interface useLessonFormProps {
  lessonId?: string | null;
  onClose: () => void;
  setIsGroup: (isGroup: boolean) => void;
  initData?: initDataType;
}

export const useLessonForm = ({
  lessonId,
  initData,
  onClose,
  setIsGroup,
}: useLessonFormProps) => {
  const [form] = Form.useForm<LessonFormValues>();
  const { initStudent, initGroup, initStart, initEnd } = initData ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const { data: student } = useGetStudentByIdQuery(initStudent ?? '');
  const { data: group } = useGetGroupByIdQuery(initGroup ?? '');
  const { data: lesson } = useGetLessonByIdQuery(lessonId ?? '');
  const { updateLessonData, createLesson, removeLesson } = useLessonActions();
  const { handleError } = useErrorHandler();
  const { buildLessonData } = useBuildLessonData(lessonId);
  const { modal } = AntApp.useApp();

  const initVal = useCallback(() => {
    if (lesson) {
      return {
        values: {
          studentIds: lesson.students
            .map((s) => s.id)
            .filter(Boolean) as string[],
          groupId: lesson.groupId,
          date: [dayjs(lesson.start), dayjs(lesson.end)],
          notes: lesson.notes || null,
          price: lesson.price,
        },
        isGroup: !!lesson.groupId,
      };
    }

    if (group) {
      return {
        values: {
          studentIds: group.studentIds.filter(Boolean) as string[],
          groupId: group.id,
          price: group.price,
        },
        isGroup: true,
      };
    }

    if (student && initStudent) {
      return {
        values: {
          studentIds: [initStudent].filter(Boolean) as string[],
          price: student.price,
        },
        isGroup: false,
      };
    }

    if (initStart && initEnd) {
      return {
        values: {
          date: [dayjs(initStart), dayjs(initEnd)],
        },
        isGroup: false,
      };
    }

    return { values: {}, isGroup: false };
  }, [lesson, group, student, initStudent, initEnd, initStart]);

  useEffect(() => {
    const initialValues = initVal();
    form.setFieldsValue(initialValues.values);
    setIsGroup(initialValues.isGroup);
  }, [form, initVal, lessonId, student, group, setIsGroup]);

  async function onFinish() {
    setIsLoading(true);

    try {
      const formValues = await form.validateFields();
      const lessonData = buildLessonData(formValues);

      if (lessonId) {
        await updateLessonData(lessonId, lessonData);
      } else {
        await createLesson(lessonData);
      }

      onClose();
    } catch (err) {
      handleError(err, 'Lesson form error');
    } finally {
      setIsLoading(false);
    }
  }

  function onDeleteHandler() {
    if (!lessonId) {
      return;
    }

    modal.confirm({
      title: 'Delete this lesson?',
      okType: 'danger',
      okText: 'Yes',
      cancelText: 'No',
      async onOk() {
        try {
          await removeLesson(lessonId);
          onClose();
        } catch (err) {
          handleError(err, 'Failed to delete lesson');
        }
      },
    });
  }

  return {
    form,
    isLoading,
    onDeleteHandler,
    onFinish,
  };
};
