import { type FC, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Spin } from 'antd';

import { StudentCard, StudentForm } from '@/components';
import { useAppSelector } from '@/hooks/reduxHooks';
import { useGetStudentsQuery } from '@/store/studentsApi';
import type { Student } from '@/types/studentTypes';

const Students: FC = () => {
  const tutorId = useAppSelector((state) => state.user.id);
  const {
    data: students,
    isLoading,
    error,
  } = useGetStudentsQuery(tutorId ?? '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);

  const showCreate = () => {
    setEditedStudent(null);
    setIsModalOpen(true);
  };

  const showEdit = (student: Student) => {
    setEditedStudent(student);
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    setEditedStudent(null);
  };

  return (
    <>
      <Flex vertical gap="large">
        <Space direction="vertical" size="large">
          <h1>Students</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={showCreate}>
            New student
          </Button>
        </Space>

        <Flex wrap gap="large">
          {error && <p style={{ color: 'red' }}>Failed to load students</p>}
          {isLoading && <Spin size="large" />}
          {students?.map((student) => (
            <StudentCard key={student.id} student={student} onEdit={showEdit} />
          ))}
        </Flex>
      </Flex>

      <StudentForm
        isModalOpen={isModalOpen}
        onClose={hideModal}
        editedStudent={editedStudent}
        isEditMode={!!editedStudent}
      />
    </>
  );
};

export default Students;
