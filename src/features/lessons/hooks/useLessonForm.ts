import { useCallback, useEffect, useState } from 'react';

import { Form, Modal } from 'antd';
import dayjs from 'dayjs';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';
import { useBuildLessonData } from '@/features/lessons/hooks/useBuildLessonData';
import { useLessonActions } from '@/features/lessons/hooks/useLessonActions';
import type { LessonFormValues } from '@/features/lessons/types/lessonTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import type { initDataType } from '@/shared/types/modalTypes';

const { confirm } = Modal;

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
  const { data: students = [] } = useGetStudentsQuery();
  const { data: groups = [] } = useGetGroupsQuery();
  const { data: lessons = [] } = useGetLessonsQuery();
  const { updateLessonData, createLesson, removeLesson } = useLessonActions();
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const { initStudent, initGroup, initStart, initEnd } = initData ?? {};
  const { buildLessonData } = useBuildLessonData();

  const initVal = useCallback(() => {
    if (lessonId) {
      const lesson = lessons.find((l) => l.id === lessonId);
      if (lesson) {
        return {
          values: {
            studentIds: lesson.students.map((s) => s.id),
            groupId: lesson.groupId,
            date: [dayjs(lesson.start), dayjs(lesson.end)],
            notes: lesson.notes || null,
            price: lesson.price,
          },
          isGroup: !!lesson.groupId,
        };
      }
    }

    if (initGroup) {
      const group = groups.find((g) => g.id === initGroup);
      if (group) {
        return {
          values: {
            studentIds: group.studentIds,
            groupId: group.id,
            price: group.price,
          },
          isGroup: true,
        };
      }
    }

    if (initStudent) {
      const student = students.find((s) => s.id === initStudent);
      return {
        values: {
          studentIds: [initStudent],
          price: student?.price,
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
  }, [
    lessonId,
    groups,
    students,
    lessons,
    initGroup,
    initStudent,
    initEnd,
    initStart,
  ]);

  useEffect(() => {
    const initialValues = initVal();
    form.setFieldsValue(initialValues.values);
    setIsGroup(initialValues.isGroup);
  }, [form, initVal, lessonId, lessons, students, groups, setIsGroup]);

  async function onFinish() {
    setIsLoading(true);

    try {
      const formValues = await form.validateFields();
      const lessonData = buildLessonData(formValues, lessonId);

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

    confirm({
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
