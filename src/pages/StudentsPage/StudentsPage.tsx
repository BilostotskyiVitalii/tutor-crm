import { type FC, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Spin, Table } from 'antd';

import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import StudentCard from '@/features/students/components/StudentCard/StudentCard';
import StudentForm from '@/features/students/components/StudentForm/StudentForm';
import { useStudentColumns } from '@/features/students/hooks/useStudentColumns';
import type { ModalState } from '@/features/students/types/studentTypes';

import styles from './StudentsPage.module.scss';

const StudentsPage: FC = () => {
  const { data: students, isLoading, isError } = useGetStudentsQuery();
  const [modalState, setModalState] = useState<ModalState>(null);

  const openStudentModal = (studentId: string | null = null) => {
    setModalState({ type: 'student', studentId });
  };

  const openLessonModal = (studentId: string) => {
    setModalState({ type: 'lesson', studentId });
  };

  const closeModal = () => setModalState(null);

  const columns = useStudentColumns({
    onEdit: openStudentModal,
    onAddLesson: openLessonModal,
  });

  return (
    <Flex className={styles.wrapper}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => openStudentModal()}
      >
        New student
      </Button>

      {isError && <p style={{ color: 'red' }}>Failed to load students</p>}
      {isLoading && <Spin size="large" />}

      {students && (
        <Table
          className={styles.studentsDesktop}
          rowKey="id"
          columns={columns}
          dataSource={students}
          pagination={{ pageSize: 30, position: ['bottomCenter'] }}
          loading={isLoading}
          locale={{ emptyText: <Empty description="No students found" /> }}
          size="small"
        />
      )}

      {students && (
        <section className={styles.studentsMobile}>
          <Flex wrap gap="large">
            {students?.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={() => openStudentModal(student.id)}
                onAddLesson={() => openLessonModal(student.id)}
              />
            ))}
          </Flex>
          {students?.length === 0 && <Empty description="No students found" />}
        </section>
      )}

      {modalState?.type === 'student' && (
        <StudentForm
          isModalOpen
          onClose={closeModal}
          editedStudentId={modalState.studentId}
        />
      )}

      {modalState?.type === 'lesson' && (
        <LessonFormModal
          isModalOpen
          onClose={closeModal}
          defaultStudent={modalState.studentId}
        />
      )}
    </Flex>
  );
};

export default StudentsPage;
