import { useAuthProfile } from '@/hooks/useAuthProfile';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useAddStudentMutation } from '@/store/studentsApi';
import type { IStudentFormValues } from '@/types/studentTypes';
import { Form, Input, InputNumber, message, Modal } from 'antd';
import { type FC } from 'react';

interface StudentFormProps {
  isModalOpen: boolean;
  onClose: () => void;
}

const StudentForm: FC<StudentFormProps> = ({ onClose, isModalOpen }) => {
  const [form] = Form.useForm<IStudentFormValues>();
  const [addStudent] = useAddStudentMutation();
  const { profile } = useAuthProfile();
  const { handleError } = useErrorHandler();

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!profile?.id) {
        message.error('Student wasn`t created!');
        return;
      }
      await addStudent({ ...values });
      message.success('Student created!');
      onClose();
      form.resetFields();
    } catch (error) {
      handleError(error, 'Student form error');
    }
  };

  return (
    <Modal
      title="New student"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Create"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" name="add_student_form">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Enter students name' }]}
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
          label="Birthdate"
          name="age"
          rules={[{ required: true, message: 'Birthdate' }]}
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
