import { type FC, useEffect } from 'react';

import { DatePicker, Form, Input, Modal, notification, Select } from 'antd';
import dayjs from 'dayjs';

import { useAppSelector } from '@/hooks/reduxHooks';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import {
  useAddLessonMutation,
  useUpdateLessonMutation,
} from '@/store/lessonsApi';
import { useGetStudentsQuery } from '@/store/studentsApi';
import type { Lesson, LessonFormValues } from '@/types/lessonTypes';

const { RangePicker } = DatePicker;

interface LessonFormModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  editedLesson?: Lesson | null;
  defaultStudents?: string[];
}

const LessonFormModal: FC<LessonFormModalProps> = ({
  isModalOpen,
  onClose,
  editedLesson,
  defaultStudents,
}) => {
  const [form] = Form.useForm<LessonFormValues>();
  const tutorId = useAppSelector((state) => state.user.id);
  const { data: students = [] } = useGetStudentsQuery(tutorId ?? '');
  const [addLesson] = useAddLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (editedLesson) {
      form.setFieldsValue({
        studentIds: editedLesson.studentIds,
        date: [dayjs(editedLesson.start), dayjs(editedLesson.end)],
        notes: editedLesson.notes ?? '',
      });
    } else {
      form.resetFields();
    }
  }, [editedLesson, form]);

  useEffect(() => {
    if (defaultStudents) {
      form.setFieldsValue({
        studentIds: defaultStudents,
      });
    } else {
      form.resetFields();
    }
  }, [defaultStudents, form]);

  const handleFinish = async () => {
    try {
      const values: LessonFormValues = await form.validateFields();

      const reqValues = {
        ...values,
        date: null,
        start: values.date[0].valueOf(),
        end: values.date[1].valueOf(),
      };

      if (editedLesson) {
        await updateLesson({ id: editedLesson.id, data: reqValues }).unwrap();
        notification.success({ message: 'Lesson updated!' });
      } else {
        await addLesson(reqValues).unwrap();
        notification.success({ message: 'Lesson created!' });
      }
      onClose();
      form.resetFields();
    } catch (err) {
      handleError(err, 'Student form error');
    }
  };

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      title={editedLesson ? 'Edit Lesson' : 'Create Lesson'}
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleFinish}
      okText={editedLesson ? 'Update' : 'Create'}
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="studentIds"
          label="Students:"
          rules={[{ required: true }]}
        >
          <Select
            mode="multiple"
            placeholder="Select students"
            options={students.map((s) => ({ label: s.name, value: s.id }))}
          />
        </Form.Item>

        <Form.Item name="date" label="Date:" rules={[{ required: true }]}>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="DD.MM.YYYY HH:mm"
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
