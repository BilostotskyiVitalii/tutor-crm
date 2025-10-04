import { type FC, useEffect, useState } from 'react';

import { DatePicker, Form, Input, InputNumber, Modal } from 'antd';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';
import LessonFormGroupSelect from '@/features/lessons/components/LessonFormModal/LessonFormGroupSelect';
import UsersSelect from '@/features/lessons/components/LessonFormModal/LessonFormUsersSelect';
import { useLessonActions } from '@/features/lessons/hooks/useLessonActions';
import type {
  LessonData,
  LessonFormModalProps,
  LessonFormValues,
} from '@/features/lessons/types/lessonTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { studentFormRules } from '@/features/students/components/StudentForm/validationFormFields';
import CurrencySelect from '@/shared/components/UI/CurrencySelect';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

const { RangePicker } = DatePicker;

const LessonFormModal: FC<LessonFormModalProps> = ({
  isModalOpen,
  onClose,
  editedLessonId,
  defaultStudent,
  defaultGroup,
}) => {
  const [form] = Form.useForm<LessonFormValues>();
  const { data: students = [] } = useGetStudentsQuery();
  const { data: groups = [] } = useGetGroupsQuery();
  const { data: lessons = [] } = useGetLessonsQuery();
  const { updateLessonData, createLesson } = useLessonActions();
  const { handleError } = useErrorHandler();
  const [isGroup, setIsGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    form.resetFields();

    if (editedLessonId) {
      const lesson = lessons.find((l) => l.id === editedLessonId);
      if (lesson) {
        form.setFieldsValue({
          studentIds: lesson.students.map((s) => s.id),
          groupId: lesson.groupId,
          date: [dayjs(lesson.start), dayjs(lesson.end)],
          notes: lesson.notes || null,
          price: lesson.price,
        });
        setIsGroup(!!lesson.groupId);
        return;
      }
    }

    if (defaultGroup) {
      const group = groups.find((g) => g.id === defaultGroup);
      if (group) {
        form.setFieldsValue({
          studentIds: group.studentIds,
          groupId: group.id,
          price: group.price,
        });
        setIsGroup(true);
        return;
      }
    }

    if (defaultStudent) {
      const student = students.find((s) => s.id === defaultStudent);
      form.setFieldsValue({
        studentIds: [defaultStudent],
        price: student?.price,
      });
      setIsGroup(false);
    }
  }, [
    isModalOpen,
    editedLessonId,
    defaultGroup,
    defaultStudent,
    lessons,
    groups,
    students,
    form,
  ]);

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const formValues: LessonFormValues = await form.validateFields();

      const lesson = editedLessonId
        ? lessons.find((l) => l.id === editedLessonId)
        : null;

      const selectedStudents: { id: string; name: string; email: string }[] =
        formValues.studentIds.map((id) => {
          const studentFromList = students.find((s) => s.id === id);
          if (studentFromList) {
            const { id: sid, name, email } = studentFromList;
            return { id: sid, name, email };
          }

          // Если студента нет в базе, берём его из урока
          const studentFromLesson = lesson?.students.find((s) => s.id === id);
          if (studentFromLesson) {
            const { id: sid, name, email } = studentFromLesson;
            return { id: sid, name, email };
          }

          // Если нигде нет, создаём "заглушку"
          return { id, name: id, email: '' };
        });

      const reqValues: LessonData = {
        students: selectedStudents,
        groupId: formValues.groupId || null,
        start: Timestamp.fromMillis(formValues.date[0].valueOf()),
        end: Timestamp.fromMillis(formValues.date[1].valueOf()),
        notes: formValues.notes || null,
        price: formValues.price,
      };

      if (editedLessonId) {
        await updateLessonData(editedLessonId, reqValues);
      } else {
        await createLesson(reqValues);
      }
      onClose();
      form.resetFields();
    } catch (err) {
      handleError(err, 'Lesson form error');
    } finally {
      setIsLoading(false);
    }
  };

  function handleCancel() {
    onClose();
    form.resetFields();
  }

  return (
    <Modal
      title={editedLessonId ? 'Edit Lesson' : 'Create Lesson'}
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleFinish}
      okText={editedLessonId ? 'Update' : 'Create'}
      cancelText="Cancel"
      confirmLoading={isLoading}
    >
      <Form form={form} layout="vertical">
        <UsersSelect editedLessonId={editedLessonId} />

        <LessonFormGroupSelect
          isGroup={isGroup}
          setIsGroup={setIsGroup}
          form={form}
        />

        <Form.Item name="date" label="Date:" rules={[{ required: true }]}>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="DD.MM.YYYY HH:mm"
          />
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
      </Form>
    </Modal>
  );
};

export default LessonFormModal;
