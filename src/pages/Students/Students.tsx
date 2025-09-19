import { StudentCard } from '@/components';
import { Button, Space, Modal, Form, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useState, type FC } from 'react';
import {
  useAddStudentMutation,
  useGetStudentsQuery,
} from '@/store/studentsApi';
import { useAuthProfile } from '@/hooks/useAuthProfile';

interface StudentFormValues {
  name: string;
  email: string;
  age: number;
}

const Students: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profile } = useAuthProfile();
  const userId = profile?.id ?? null;
  const { isLoading, data: students } = useGetStudentsQuery(userId);
  const [addStudent] = useAddStudentMutation();
  const [form] = Form.useForm<StudentFormValues>();

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!profile?.id) {
        message.error('Профиль не загружен');
        return;
      }
      await addStudent({ userId: profile?.id, ...values });
      message.success('Студент создан!');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.log('Ошибка валидации', error);
    }
  };

  return (
    <>
      <h1 className="pageTitle">Students</h1>
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          New student
        </Button>
      </div>
      <Space size="large" wrap>
        {students?.map((student) => (
          // <StudentCard key={student.id} student={student} />
          <Button key={student.id}>{student.email}</Button>
        ))}
      </Space>
      <Modal
        title="Новый студент"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isLoading}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" name="add_student_form">
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Введите имя студента' }]}
          >
            <Input placeholder="Иван Иванов" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Неверный формат email' },
            ]}
          >
            <Input placeholder="ivan@example.com" />
          </Form.Item>

          <Form.Item
            label="Возраст"
            name="age"
            rules={[
              { required: true, message: 'Введите возраст' },
              {
                type: 'number',
                min: 14,
                max: 100,
                message: 'Возраст от 14 до 100 лет',
              },
            ]}
          >
            <Input type="number" placeholder="14" min={14} max={100} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Students;
