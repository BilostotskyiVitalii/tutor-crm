import { type FC, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Spin, Table } from 'antd';

import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import StudentCard from '@/features/students/components/StudentCard/StudentCard';
import StudentForm from '@/features/students/components/StudentForm/StudentForm';
import { useStudentColumns } from '@/features/students/hooks/useStudentColumns';
import type {
  ModalState,
  Student,
} from '@/features/students/types/studentTypes';

import styles from './StudentsPage.module.scss';

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

  const columns = useStudentColumns({
    onEdit: openStudentModal,
    onAddLesson: openLessonModal,
  });

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openStudentModal()}
        >
          New student
        </Button>
      </div>

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
        />
      )}

      {students && (
        <section className={styles.studentsMobile}>
          <Flex wrap gap="large">
            {students?.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={() => openStudentModal(student)}
                onAddLesson={() => openLessonModal(student)}
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
