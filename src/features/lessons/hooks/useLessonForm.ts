import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { App as AntApp, Form } from 'antd';
import dayjs from 'dayjs';

import { useBuildLessonData } from '@/features/lessons/hooks/useBuildLessonData';
import { useLessonActions } from '@/features/lessons/hooks/useLessonActions';
import type {
  Lesson,
  LessonFormValues,
} from '@/features/lessons/types/lessonTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import type { initDataType } from '@/shared/types/modalTypes';
import { getChangedFields } from '@/shared/utils/getChangedFields';

interface useLessonFormProps {
  lesson?: Lesson | null;
  onClose: () => void;
  setIsGroup: (isGroup: boolean) => void;
  initData?: initDataType;
}

export const useLessonForm = ({
  lesson,
  initData,
  onClose,
  setIsGroup,
}: useLessonFormProps) => {
  const [form] = Form.useForm<LessonFormValues>();
  const { initStudent, initGroup, initStart, initEnd } = initData ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const { updateLessonData, createLesson, removeLesson } = useLessonActions();
  const { handleError } = useErrorHandler();
  const { buildLessonData } = useBuildLessonData(lesson?.id);
  const { modal } = AntApp.useApp();
  const { t } = useTranslation();

  const initVal = useCallback((): {
    values: Partial<LessonFormValues>;
    isGroup: boolean;
  } => {
    if (lesson) {
      return {
        values: {
          studentIds: lesson.students?.map((s) => s.id).filter(Boolean) ?? [],
          groupId: lesson.groupId ?? null,
          date: [dayjs(lesson.start), dayjs(lesson.end)],
          notes: lesson.notes ?? null,
          price: lesson.price,
        },
        isGroup: !!lesson.groupId,
      };
    }

    if (initStudent) {
      return {
        values: {
          studentIds: [initStudent.id],
          price: initStudent.price,
        },
        isGroup: false,
      };
    }

    if (initGroup) {
      return {
        values: {
          studentIds: initGroup.studentIds?.filter(Boolean) ?? [],
          groupId: initGroup.id,
          price: initGroup.price,
        },
        isGroup: true,
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
  }, [lesson, initGroup, initStudent, initStart, initEnd]);

  useEffect(() => {
    const initial = initVal();
    form.setFieldsValue(initial.values);
    setIsGroup(initial.isGroup);
  }, [form, initVal, lesson, initStudent, initGroup, setIsGroup]);

  async function onFinish() {
    setIsLoading(true);

    try {
      const formValues = await form.validateFields();
      const lessonData = buildLessonData(formValues);

      if (lesson) {
        const changedFields = getChangedFields(lessonData, lesson);

        if (Object.keys(changedFields).length > 0) {
          await updateLessonData(lesson.id, changedFields);
        }
      } else {
        await createLesson(lessonData);
      }

      onClose();
    } catch (err) {
      handleError(err, `${t('form.lessonFormError')}`);
    } finally {
      setIsLoading(false);
    }
  }

  function onDeleteHandler() {
    if (!lesson) {
      return;
    }

    modal.confirm({
      title: `${t('useLessonAction.deleteConfirm')}`,
      okType: 'danger',
      okText: `${t('okText')}`,
      cancelText: `${t('cancelText')}`,
      async onOk() {
        try {
          await removeLesson(lesson.id);
          onClose();
        } catch (err) {
          handleError(err, `${t('form.deleteFailed')}`);
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
