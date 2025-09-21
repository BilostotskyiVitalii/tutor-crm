import { type FC, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import type { Lesson } from '@/types/lessonTypes';
import {
  useCreateLessonMutation,
  useUpdateLessonMutation,
} from '@/store/lessonsApi';
import { useGetStudentsQuery } from '@/store/studentsApi';
import { useAppSelector } from '@/hooks/reduxHooks';

interface LessonFormModalProps {
  visible: boolean;
  onClose: () => void;
  lesson?: Lesson;
}

interface LessonFormValues {
  title: string;
  type: 'individual' | 'group';
  studentIds: string[];
  start: Date;
  end: Date;
  notes?: string;
}

const LessonFormModal: FC<LessonFormModalProps> = ({
  visible,
  onClose,
  lesson,
}) => {
  const [form] = Form.useForm<LessonFormValues>();
  const tutorId = useAppSelector((state) => state.user.id);
  const { data: students = [] } = useGetStudentsQuery(tutorId ?? '');
  const [createLesson] = useCreateLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();

  useEffect(() => {
    if (lesson) {
      form.setFieldsValue({
        title: lesson.title,
        studentIds: lesson.studentIds,
        start: lesson.start ? new Date(lesson.start) : undefined,
        end: lesson.end ? new Date(lesson.end) : undefined,
        notes: lesson.notes,
      });
    } else {
      form.resetFields();
    }
  }, [lesson, form]);

  const handleFinish = async (values: LessonFormValues) => {
    const payload: Omit<Lesson, 'id' | 'tutorId'> = {
      ...values,
      start: values.start.toISOString(),
      end: values.end.toISOString(),
    };

    try {
      if (lesson) {
        await updateLesson({ id: lesson.id, data: payload }).unwrap();
      } else {
        await createLesson(payload).unwrap();
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={lesson ? 'Edit Lesson' : 'Create Lesson'}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="studentIds"
          label="Students"
          rules={[{ required: true }]}
        >
          <Select
            mode="multiple"
            placeholder="Select students"
            options={students.map((s) => ({ label: s.name, value: s.id }))}
          />
        </Form.Item>

        <Form.Item name="start" label="Start" rules={[{ required: true }]}>
          <DatePicker showTime />
        </Form.Item>

        <Form.Item name="end" label="End" rules={[{ required: true }]}>
          <DatePicker showTime />
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {lesson ? 'Update' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LessonFormModal;
