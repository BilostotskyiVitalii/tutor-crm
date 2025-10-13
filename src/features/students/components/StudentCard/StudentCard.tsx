import { type FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';
import { Badge, Card, Dropdown, type MenuProps } from 'antd';

import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import {
  type Student,
  studentStatus,
} from '@/features/students/types/studentTypes';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useModal } from '@/shared/providers/ModalProvider';

import styles from './StudentCard.module.scss';

const { Meta } = Card;

const { active, inactive } = studentStatus;

interface StudentCardProps {
  student: Student;
}

const StudentCard: FC<StudentCardProps> = ({ student }) => {
  const { removeStudent, updateStudentStatus, isDeleting } =
    useStudentActions();
  const { openModal } = useModal();

  const menuItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: active,
        label: active,
        disabled: student.isActive,
        onClick: () => updateStudentStatus({ id: student.id, newStatus: true }),
      },
      {
        key: inactive,
        label: inactive,
        disabled: !student.isActive,
        onClick: () =>
          updateStudentStatus({ id: student.id, newStatus: false }),
      },
      { type: 'divider' },
      {
        key: 'delete',
        label: 'delete',
        onClick: () => removeStudent(student.id),
        danger: true,
        icon: <DeleteOutlined />,
      },
    ],
    [student.id, student.isActive, updateStudentStatus, removeStudent],
  );

  const cardActions = useMemo(
    () => [
      <PlusOutlined
        key="add"
        onClick={() =>
          openModal({
            type: 'lesson',
            mode: 'create',
            initData: { initStudent: student.id },
          })
        }
      />,
      <EditOutlined
        key="edit"
        onClick={() =>
          openModal({
            type: 'student',
            mode: 'edit',
            entityId: student.id,
          })
        }
      />,
      <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="top">
        <MoreOutlined key="more" />
      </Dropdown>,
    ],
    [openModal, student.id, menuItems],
  );

  return (
    <Badge.Ribbon
      text={student.isActive ? active : inactive}
      color={student.isActive ? 'green' : 'grey'}
    >
      <Card loading={isDeleting} className={styles.card} actions={cardActions}>
        <Meta
          avatar={
            <AvatarCustom src={student.avatarUrl ?? ''} name={student.name} />
          }
          title={
            <Link to={`${navigationUrls.students}/${student.id}`}>
              {student.name}
            </Link>
          }
          description={
            <>
              <p>{student.currentLevel}</p>
              <strong>{student.price}</strong>
            </>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default StudentCard;
