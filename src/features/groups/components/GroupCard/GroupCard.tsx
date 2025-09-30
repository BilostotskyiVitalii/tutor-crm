import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Card, notification, Popconfirm, Tooltip } from 'antd';

import { useGroupActions } from '@/features/groups/hooks/useGroupActions';
import type { Group } from '@/features/groups/types/groupTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { getAvatarColorClass } from '@/shared/utils/getAvatarColorClass';

import styles from './GroupCard.module.scss';

interface GroupCardProps {
  group: Group;
  onEdit: (lesson: Group) => void;
  onAddLesson: (group: Group) => void;
}

const GroupCard: FC<GroupCardProps> = ({ group, onEdit, onAddLesson }) => {
  const { data: students } = useGetStudentsQuery();
  const { removeGroup, isDeleting } = useGroupActions();

  const filteredStudents = students?.filter((student) =>
    group.studentIds.includes(student.id),
  );

  async function removeHandler() {
    try {
      await removeGroup(group.id);
      notification.success({
        message: 'Group deleted!',
      });
    } catch {
      notification.error({
        message: 'Failed to delete group',
      });
    }
  }

  return (
    <Card
      loading={isDeleting}
      className={styles.card}
      actions={[
        <PlusOutlined key="add" onClick={() => onAddLesson(group)} />,
        <EditOutlined key="edit" onClick={() => onEdit(group)} />,
        <Popconfirm
          title="Delete this group?"
          okText="Yes"
          cancelText="No"
          onConfirm={removeHandler}
        >
          <DeleteOutlined key="delete" className={styles.delete} />
        </Popconfirm>,
      ]}
    >
      <div className={styles.cardContent}>
        <Avatar.Group
          size={80}
          max={{
            count: 3,
          }}
        >
          {filteredStudents?.map((student) => (
            <Tooltip key={student.id} title={student.name} placement="top">
              <Avatar
                src={student.avatarUrl}
                className={`${styles.avatar} ${styles[getAvatarColorClass(student.name)]}`}
              >
                {student.name[0]}
              </Avatar>
            </Tooltip>
          ))}
        </Avatar.Group>

        <div className={styles.groupInfo}>
          <Link to={`${navigationUrls.groups}/${group.id}`}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
          </Link>
          <p className={styles.groupDescription}>{group.notes}</p>
        </div>
      </div>
    </Card>
  );
};

export default GroupCard;
