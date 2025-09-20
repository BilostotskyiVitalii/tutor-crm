import { useAuthProfile } from '@/hooks/useAuthProfile';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import {
  useAddStudentMutation,
  useUpdateStudentMutation,
} from '@/store/studentsApi';
import type { IStudent, IStudentFormValues } from '@/types/studentTypes';
import { Form, Input, InputNumber, Modal, notification } from 'antd';
import { useEffect, type FC } from 'react';

interface StudentFormProps {
  isModalOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  editedStudent?: IStudent | null;
}

const StudentForm: FC<StudentFormProps> = ({
  onClose,
  isModalOpen,
  isEditMode,
  editedStudent,
}) => {
  const [form] = Form.useForm<IStudentFormValues>();
  const [addStudent] = useAddStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const { profile } = useAuthProfile();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (isModalOpen) {
      if (isEditMode && editedStudent) {
        form.setFieldsValue(editedStudent);
      } else {
        form.resetFields();
      }
    }
  }, [isModalOpen, isEditMode, editedStudent, form]);

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!profile?.id) {
        notification.error({ message: 'Student wasn’t created!' });
        return;
      }

      if (isEditMode && editedStudent) {
        await updateStudent({ id: editedStudent.id, data: values }).unwrap();
        notification.success({ message: 'Student updated!' });
      } else {
        await addStudent(values).unwrap();
        notification.success({ message: 'Student created!' });
      }

      onClose();
      form.resetFields();
    } catch (error) {
      handleError(error, 'Student form error');
    }
  };

  return (
    <Modal
      title={isEditMode ? 'Update student' : 'New student'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isEditMode ? 'Update' : 'Create'}
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" name="student_form">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Enter student name' }]}
        >
          <Input placeholder="John Snow" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Enter email' },
            { type: 'email', message: 'Wrong email format' },
          ]}
        >
          <Input placeholder="john@example.com" />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[{ required: true, message: 'Enter age' }]}
        >
          <InputNumber
            type="number"
            placeholder="14"
            min={14}
            max={100}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentForm;
