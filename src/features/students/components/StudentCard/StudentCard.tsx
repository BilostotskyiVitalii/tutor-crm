import { type FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Badge, Card, Dropdown } from 'antd';

import { getStudentMenuItems } from '@/features/students/components/StudentCard/getStudentMenuItems';
import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import type { Student } from '@/features/students/types/studentTypes';
import { getRibbonProps } from '@/features/students/utils/studentUtils';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { getAvatarColorClass } from '@/shared/utils/getAvatarColorClass';

import styles from './StudentCard.module.scss';

const { Meta } = Card;

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onAddLesson: (student: Student) => void;
}

const StudentCard: FC<StudentCardProps> = ({
  student,
  onEdit,
  onAddLesson,
}) => {
  const { removeStudent, updateStudentStatus, isDeleting } = useStudentActions(
    student.id,
  );

  const menuItems = useMemo(
    () =>
      getStudentMenuItems(student, {
        onDelete: removeStudent,
        onChangeStatus: updateStudentStatus,
      }),
    [student, removeStudent, updateStudentStatus],
  );

  const cardActions = [
    <PlusOutlined key="add" onClick={() => onAddLesson(student)} />,
    <EditOutlined key="edit" onClick={() => onEdit(student)} />,
    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="top">
      <MoreOutlined key="more" className={styles.more} />
    </Dropdown>,
  ];

  const ribbonProps = getRibbonProps(student.status);

  return (
    <Badge.Ribbon text={ribbonProps.text} color={ribbonProps.color}>
      <Card loading={isDeleting} className={styles.card} actions={cardActions}>
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
              <p>{student.currentLevel}</p>
              <strong>{student.cost}</strong>
            </>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default StudentCard;
