import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Card, notification, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDeleteStudentMutation } from '@/store/studentsApi';
import { navigationUrls } from '@/constants/navigationUrls';
import type { IStudent } from '@/types/studentTypes';
import styles from './StudentCard.module.scss';

const { Meta } = Card;

interface IStudentCardProps {
  student: IStudent;
  onEdit: (student: IStudent) => void;
}

const StudentCard: FC<IStudentCardProps> = ({ student, onEdit }) => {
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

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

  return (
    <Card
      loading={isDeleting}
      className={styles.card}
      actions={[
        <PlusOutlined key="add" onClick={() => console.log('Add lesson')} />,
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
            size={64}
            src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${student.id}`}
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
