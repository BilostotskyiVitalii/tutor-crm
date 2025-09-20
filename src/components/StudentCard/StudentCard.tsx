import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Card } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import { useDeleteStudentMutation } from '@/store/studentsApi';
import { navigationUrls } from '@/constants/navigationUrls';
import type { IStudent } from '@/types/studentTypes';

import styles from './StudentCard.module.scss';

const { Meta } = Card;

interface IStudentCardProps {
  student: IStudent;
}

const StudentCard: FC<IStudentCardProps> = ({ student }) => {
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

  function addLessonHandler() {
    console.log('ADDed LESSON');
  }

  function removeHandler() {
    deleteStudent(student.id);
  }

  return (
    <Card
      loading={isDeleting}
      className={styles.card}
      actions={[
        <PlusOutlined key="add" onClick={addLessonHandler} />,
        <EditOutlined key="edit" />,
        <DeleteOutlined
          key="delete"
          className={styles.delete}
          onClick={removeHandler}
        />,
      ]}
    >
      <Meta
        avatar={
          <Avatar
            size={64}
            src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"
          />
        }
        title={
          <Link to={`${navigationUrls.students}/${student.id}`}>
            <span>{student.name}</span>
          </Link>
        }
        description={student.email}
      />
    </Card>
  );
};

export default StudentCard;
