import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Empty, Flex, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import StudentCard from '@/features/students/components/StudentCard/StudentCard';
import { StatusDropdown } from '@/features/students/components/StudentStatusDropdown/StudentStatusDropdown';
import { studentStatus } from '@/features/students/constants/constants';
import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import type {
  ModalState,
  Student,
} from '@/features/students/types/studentTypes';
import { useModal } from '@/shared/providers/ModalProvider';
import { getAvatarColorClass } from '@/shared/utils/getAvatarColorClass';

import styles from './StudentsPage.module.scss';

const { active, inactive } = studentStatus;

const StudentsPage: FC = () => {
  const { data: students, isLoading, isError } = useGetStudentsQuery();
  const [modalState, setModalState] = useState<ModalState>(null);
  const { removeStudent } = useStudentActions();

  const openLessonModal = (studentId: string) => {
    setModalState({ type: 'lesson', studentId });
  };

  const { openModal } = useModal();

  const closeModal = () => setModalState(null);

  const columns: ColumnsType<Student> = [
    {
      title: 'Avatar',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: (avatarUrl: string | null, student) => (
        <Avatar
          src={avatarUrl ?? undefined}
          className={`avatar ${
            student.isActive
              ? getAvatarColorClass(student.name)
              : 'avatar-inactive'
          }`}
          size={50}
        >
          {!avatarUrl && student.name?.[0]}
        </Avatar>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, student) => (
        <Link to={`${students}/${student.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: active, value: true },
        { text: inactive, value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (_, student) => <StatusDropdown student={student} />,
    },
    {
      title: 'Level',
      dataIndex: 'currentLevel',
      key: 'currentLevel',
      sorter: (a, b) => a.currentLevel.localeCompare(b.currentLevel),
      render: (val) => val,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => (a.price ?? 0) - (b.price ?? 0),
      render: (val) => (val !== null ? `₴ ${val}` : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, student) => (
        <>
          <Button
            onClick={() =>
              openModal({
                type: 'student',
                mode: 'edit',
                entityId: student.id,
              })
            }
            size="small"
          >
            {' '}
            Edit
          </Button>{' '}
          <Button
            // onClick={() => onAddLesson(student.id)}
            size="small"
            disabled={!student.isActive}
          >
            Add Lesson
          </Button>{' '}
          <Button onClick={() => removeStudent(student.id)} size="small" danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Flex className={styles.wrapper}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() =>
          openModal({
            type: 'student',
            mode: 'create',
          })
        }
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
                onEdit={() =>
                  openModal({
                    type: 'student',
                    mode: 'create',
                  })
                }
                onAddLesson={() => openLessonModal(student.id)}
              />
            ))}
          </Flex>
          {students?.length === 0 && <Empty description="No students found" />}
        </section>
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
