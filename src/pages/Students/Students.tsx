import { type FC, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Spin } from 'antd';

import { StudentCard, StudentForm } from '@/components';
import { useGetStudentsQuery } from '@/store/studentsApi';
import type { Student } from '@/types/studentTypes';

const Students: FC = () => {
  const { data: students, isLoading, isError } = useGetStudentsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);

  const openModal = (student: Student | null = null) => {
    setEditedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditedStudent(null);
  };

  return (
    <>
      <Flex vertical gap="large">
        <Space direction="vertical" size="large">
          <h1>Students</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal(null)}
          >
            New student
          </Button>
        </Space>

        <Flex wrap gap="large">
          {isError && <p style={{ color: 'red' }}>Failed to load students</p>}
          {isLoading && <Spin size="large" />}
          {students?.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={() => openModal(student)}
            />
          ))}
        </Flex>
      </Flex>

      <StudentForm
        isModalOpen={isModalOpen}
        onClose={closeModal}
        editedStudent={editedStudent}
      />
    </>
  );
};

export default Students;
