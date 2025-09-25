import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Card, notification, Popconfirm } from 'antd';

import { LessonFormModal } from '@/components';
import { navigationUrls } from '@/constants/navigationUrls';
import { useDeleteStudentMutation } from '@/store/studentsApi';
import type { Student } from '@/types/studentTypes';
import { getAvatarColorClass } from '@/utils/getAvatarColorClass';

import styles from './StudentCard.module.scss';

const { Meta } = Card;

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
}

const StudentCard: FC<StudentCardProps> = ({ student, onEdit }) => {
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  async function removeHandler() {
    try {
      await deleteStudent(student.id).unwrap();
      notification.success({
        message: 'Student deleted!',
      });
    } catch {
      notification.error({
        message: 'Failed to delete student',
      });
    }
  }

  function onClose() {
    setIsModalOpen(false);
  }

  return (
    <>
      <Card
        loading={isDeleting}
        className={styles.card}
        actions={[
          <PlusOutlined key="add" onClick={() => setIsModalOpen(true)} />,
          <EditOutlined key="edit" onClick={() => onEdit(student)} />,
          <Popconfirm
            title="Delete this student?"
            okText="Yes"
            cancelText="No"
            onConfirm={removeHandler}
          >
            <DeleteOutlined key="delete" className={styles.delete} />
          </Popconfirm>,
        ]}
      >
        <Meta
          avatar={
            <Avatar
              size={70}
              src={student.avatarUrl}
              className={`${styles.avatar} ${styles[getAvatarColorClass(student.name)]}`}
            >
              {student.name[0]}
            </Avatar>
          }
          title={
            <Link to={`${navigationUrls.students}/${student.id}`}>
              <span>{student.name}</span>
            </Link>
          }
          description={
            <>
              <p>{student.notes}</p>
              <strong>{student.cost}</strong>
            </>
          }
        />
      </Card>
      <LessonFormModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        defaultStudents={[student.id]}
      />
    </>
  );
};

export default StudentCard;
