import { type FC, useCallback, useEffect, useState } from 'react';

import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
} from 'antd';
import dayjs from 'dayjs';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';
import LessonFormGroupSelect from '@/features/lessons/components/LessonFormGroupSelect/LessonFormGroupSelect';
import UsersSelect from '@/features/lessons/components/LessonFormUsersSelect/LessonFormUsersSelect';
import { useLessonActions } from '@/features/lessons/hooks/useLessonActions';
import type { LessonFormValues } from '@/features/lessons/types/lessonTypes';
import { buildLessonData } from '@/features/lessons/utils/buildLessonData';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { studentFormRules } from '@/features/students/utils/validationFormFields';
import CurrencySelect from '@/shared/components/UI/CurrencySelect/CurrencySelect';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

const { RangePicker } = DatePicker;
const { confirm } = Modal;

interface LessonFormProps {
  mode?: string;
  onClose: () => void;
  lessonId?: string | null;
  preload?: {
    preStudent?: string | null;
    preGroup?: string | null;
    preStart?: Date | null;
    preEnd?: Date | null;
  };
}

const LessonForm: FC<LessonFormProps> = ({
  mode,
  onClose,
  lessonId,
  preload,
}) => {
  const [form] = Form.useForm<LessonFormValues>();
  const { data: students = [] } = useGetStudentsQuery();
  const { data: groups = [] } = useGetGroupsQuery();
  const { data: lessons = [] } = useGetLessonsQuery();
  const [isGroup, setIsGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateLessonData, createLesson, removeLesson } = useLessonActions();
  const { handleError } = useErrorHandler();
  const { preStudent, preGroup, preStart, preEnd } = preload ?? {};

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

    if (preGroup) {
      const group = groups.find((g) => g.id === preGroup);
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

    if (preStudent) {
      const student = students.find((s) => s.id === preStudent);
      return {
        values: {
          studentIds: [preStudent],
          price: student?.price,
        },
        isGroup: false,
      };
    }

    if (preStart && preEnd) {
      return {
        values: {
          date: [dayjs(preStart), dayjs(preEnd)],
        },
        isGroup: false,
      };
    }
    return { values: {}, isGroup: false };
  }, [
    groups,
    lessonId,
    lessons,
    preEnd,
    preGroup,
    preStart,
    preStudent,
    students,
  ]);

  useEffect(() => {
    const initialValues = initVal();
    form.setFieldsValue(initialValues.values);
    setIsGroup(initialValues.isGroup);
  }, [form, initVal, lessonId, lessons, students, groups]);

  const onFinish = async () => {
    setIsLoading(true);
    try {
      const formValues = await form.validateFields();
      const lessonData = buildLessonData(
        formValues,
        students,
        lessons,
        lessonId,
      );

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
  };

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

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <UsersSelect editedLessonId={lessonId} />

      <LessonFormGroupSelect
        isGroup={isGroup}
        setIsGroup={setIsGroup}
        form={form}
      />

      <Form.Item name="date" label="Date:" rules={[{ required: true }]}>
        <RangePicker showTime={{ format: 'HH:mm' }} format="DD.MM.YYYY HH:mm" />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price:"
        style={{ flex: 1 }}
        rules={studentFormRules.price}
      >
        <InputNumber
          min={0}
          placeholder="500"
          addonAfter={<CurrencySelect />}
        />
      </Form.Item>

      <Form.Item name="notes" label="Notes:">
        <Input.TextArea rows={3} placeholder="Note some info here" />
      </Form.Item>

      <Form.Item>
        <Flex justify={mode === 'edit' ? 'space-between' : 'flex-end'}>
          {mode === 'edit' && (
            <Space>
              <Button danger htmlType="button" onClick={onDeleteHandler}>
                Delete
              </Button>
            </Space>
          )}
          <Space>
            <Button htmlType="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </Space>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default LessonForm;
