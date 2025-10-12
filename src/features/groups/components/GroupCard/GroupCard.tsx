import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Card, Flex, Typography } from 'antd';

import { useGroupActions } from '@/features/groups/hooks/useGroupActions';
import { useGroupCard } from '@/features/groups/hooks/useGroupCard';
import type { Group } from '@/features/groups/types/groupTypes';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';
import { navigationUrls } from '@/shared/constants/navigationUrls';

import styles from './GroupCard.module.scss';

const { Title, Paragraph } = Typography;

interface GroupCardProps {
  group: Group;
}

const GroupCard: FC<GroupCardProps> = ({ group }) => {
  const { removeGroup } = useGroupActions();
  const { onAddLesson, onEditGroup, filteredStudents } = useGroupCard(group);

  return (
    <Card
      className={styles.card}
      actions={[
        <PlusOutlined key="add" onClick={onAddLesson} />,
        <EditOutlined key="edit" onClick={onEditGroup} />,
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
            <AvatarCustom src={student.avatarUrl ?? null} name={student.name} />
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
