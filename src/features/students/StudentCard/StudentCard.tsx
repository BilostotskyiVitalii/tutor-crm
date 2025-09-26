import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Card,
  Dropdown,
  type MenuProps,
  notification,
  Popconfirm,
} from 'antd';

import LessonFormModal from '@/features/lessons/LessonFormModal/LessonFormModal';
import {
  useDeleteStudentMutation,
  useUpdateStudentMutation,
} from '@/features/students/studentsApi';
import type { Student, StudentStatus } from '@/features/students/studentTypes';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { getAvatarColorClass } from '@/shared/utils/getAvatarColorClass';

import styles from './StudentCard.module.scss';

const { Meta } = Card;

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
}

const StudentCard: FC<StudentCardProps> = ({ student, onEdit }) => {
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [updateStudent] = useUpdateStudentMutation();

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

  async function handleStatusChange(newStatus: StudentStatus) {
    try {
      await updateStudent({
        id: student.id,
        data: { status: newStatus },
      }).unwrap();
      notification.success({
        message: 'Status updated!',
      });
    } catch {
      notification.error({
        message: 'Failed to update status',
      });
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'active',
      label: 'Active',
      disabled: student.status === 'active',
      onClick: () => handleStatusChange('active'),
    },
    {
      key: 'paused',
      label: 'Pause',
      disabled: student.status === 'paused',
      onClick: () => handleStatusChange('paused'),
    },
    {
      key: 'archive',
      label: 'Archived',
      disabled: student.status === 'archived',
      onClick: () => handleStatusChange('archived'),
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: (
        <Popconfirm
          title="Delete this student?"
          okText="Yes"
          cancelText="No"
          onConfirm={removeHandler}
        >
          <span>Delete</span>
        </Popconfirm>
      ),
      danger: true,
      icon: <DeleteOutlined />,
    },
  ];

  const getRibbonProps = (status: StudentStatus) => {
    switch (status) {
      case 'active':
        return { text: 'Active', color: 'green' };
      case 'paused':
        return { text: 'Paused', color: 'orange' };
      case 'archived':
        return { text: 'Archived', color: 'gray' };
      default:
        return { text: '', color: 'gray' };
    }
  };

  const ribbonProps = getRibbonProps(student.status);

  return (
    <>
      <Badge.Ribbon text={ribbonProps.text} color={ribbonProps.color}>
        <Card
          loading={isDeleting}
          className={styles.card}
          actions={[
            <PlusOutlined key="add" onClick={() => setIsModalOpen(true)} />,
            <EditOutlined key="edit" onClick={() => onEdit(student)} />,
            <Dropdown
              menu={{ items: menuItems }}
              trigger={['click']}
              placement="top"
            >
              <MoreOutlined key="more" className={styles.more} />
            </Dropdown>,
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
      </Badge.Ribbon>
      <LessonFormModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        defaultStudents={[student.id]}
      />
    </>
  );
};

export default StudentCard;
