import { type FC, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Spin } from 'antd';

import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import StudentCard from '@/features/students/components/StudentCard/StudentCard';
import StudentForm from '@/features/students/components/StudentForm/StudentForm';
import type {
  ModalState,
  Student,
} from '@/features/students/types/studentTypes';

const StudentsPage: FC = () => {
  const { data: students, isLoading, isError } = useGetStudentsQuery();
  const [modalState, setModalState] = useState<ModalState>(null);

  const openStudentModal = (student: Student | null = null) => {
    setModalState({ type: 'student', student });
  };

  const openLessonModal = (student: Student) => {
    setModalState({ type: 'lesson', student });
  };

  const closeModal = () => setModalState(null);

  return (
    <>
      <Flex vertical gap="large">
        <Space direction="vertical" size="large">
          <h1>Students</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openStudentModal()}
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
              onEdit={() => openStudentModal(student)}
              onAddLesson={() => openLessonModal(student)}
            />
          ))}
        </Flex>
      </Flex>

      {modalState?.type === 'student' && (
        <StudentForm
          isModalOpen
          onClose={closeModal}
          editedStudent={modalState.student}
        />
      )}

      {modalState?.type === 'lesson' && (
        <LessonFormModal
          isModalOpen
          onClose={closeModal}
          defaultStudents={[modalState.student.id]}
        />
      )}
    </>
  );
};

export default StudentsPage;
