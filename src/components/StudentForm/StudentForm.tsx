import { useAuthProfile } from '@/hooks/useAuthProfile';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import {
  useAddStudentMutation,
  useUpdateStudentMutation,
} from '@/store/studentsApi';
import type { IStudent, IStudentFormValues } from '@/types/studentTypes';
import { Form, Input, InputNumber, message, Modal } from 'antd';
import { useEffect, type FC } from 'react';

interface StudentFormProps {
  isModalOpen: boolean;
  onClose: () => void;
  editedStudent?: IStudent | null;
}

const StudentForm: FC<StudentFormProps> = ({
  onClose,
  isModalOpen,
  editedStudent,
}) => {
  const [form] = Form.useForm<IStudentFormValues>();
  const [addStudent] = useAddStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const { profile } = useAuthProfile();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (editedStudent) {
      form.setFieldsValue({
        name: editedStudent.name,
        email: editedStudent.email,
        age: editedStudent.age,
      });
    } else {
      form.resetFields();
    }
  }, [isModalOpen, editedStudent, form]);

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
      if (editedStudent) {
        await updateStudent({
          id: editedStudent.id,
          data: values,
        });
      } else {
        await addStudent({ ...values });
      }
      message.success('Student created!');
      onClose();
      form.resetFields();
    } catch (error) {
      handleError(error, 'Student form error');
    }
  };

  return (
    <Modal
      title={editedStudent ? 'Update student' : 'New student'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={editedStudent ? 'Update' : 'Create'}
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
