import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Card, Flex, Tooltip, Typography } from 'antd';

import { useGroupActions } from '@/features/groups/hooks/useGroupActions';
import type { Group } from '@/features/groups/types/groupTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useModal } from '@/shared/providers/ModalProvider';
import { getAvatarColorClass } from '@/shared/utils/getAvatarColorClass';

import styles from './GroupCard.module.scss';

const { Title, Paragraph } = Typography;

interface GroupCardProps {
  group: Group;
}

const GroupCard: FC<GroupCardProps> = ({ group }) => {
  const { data: students } = useGetStudentsQuery();
  const { removeGroup, isDeleting } = useGroupActions();
  const { openModal } = useModal();

  const filteredStudents = students?.filter((student) =>
    group.studentIds.includes(student.id),
  );

  return (
    <Card
      loading={isDeleting}
      className={styles.card}
      actions={[
        <PlusOutlined
          key="add"
          onClick={() =>
            openModal({
              type: 'lesson',
              mode: 'create',
              entityId: group.id,
              extra: { preGroup: group.id },
            })
          }
        />,
        <EditOutlined
          key="edit"
          onClick={() =>
            openModal({
              type: 'group',
              mode: 'edit',
              entityId: group.id,
            })
          }
        />,
        <DeleteOutlined
          key="delete"
          onClick={() => removeGroup(group.id)}
          className={styles.delete}
        />,
      ]}
    >
      <Flex className={styles.contentWrapper}>
        <Avatar.Group size={65} max={{ count: 3 }}>
          {filteredStudents?.map((student) => (
            <Tooltip key={student.id} title={student.name} placement="top">
              <Avatar
                src={student.avatarUrl}
                className={`$avatar ${[getAvatarColorClass(student.name)]}`}
              >
                {student.name[0]}
              </Avatar>
            </Tooltip>
          ))}
        </Avatar.Group>

        <div className={styles.info}>
          <Link to={`${navigationUrls.groups}/${group.id}`}>
            <Title className={styles.title} level={4}>
              {group.title}
            </Title>
          </Link>
          <Paragraph disabled={!group.notes} className={styles.notes} italic>
            {group.notes || 'No notes'}
          </Paragraph>
          <Paragraph className={styles.price} italic>
            Price: {group.price}
          </Paragraph>
        </div>
      </Flex>
    </Card>
  );
};

export default GroupCard;
