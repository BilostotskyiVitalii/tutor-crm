import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Avatar, Card, Divider, Typography } from 'antd';

import { GroupActionsButtons } from '@/features/groups/components/GroupActionsButtons/GroupActionsButtons';
import type { Group } from '@/features/groups/types/groupTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';

import styles from './GroupInfoCard.module.scss';

const { Text } = Typography;

type Props = {
  group: Group;
};

export const GroupInfoCard: FC<Props> = ({ group }) => {
  const { data: students } = useGetStudentsQuery();
  const filteredStudents = students?.filter((student) =>
    group.studentIds.includes(student.id),
  );
  const { t } = useTranslation();

  return (
    <Card className={styles.groupCard}>
      <Avatar.Group size={65} max={{ count: 3 }}>
        {filteredStudents?.map((student) => (
          <AvatarCustom
            key={student.id}
            src={student.avatarUrl ?? null}
            name={student.name}
          />
        ))}
      </Avatar.Group>
      <Divider />
      <h2>{group.title}</h2>
      <p>
        <Text strong>{`💵 ${t('pricePH')}: ₴ `}</Text> {group.price ?? '-'}
      </p>
      <p>
        <Text strong>{`🍼 ${t('createdAt')}: `}</Text>
        {group.createdAt ? new Date(group.createdAt).toLocaleDateString() : '-'}
      </p>
      <p>
        <Text strong>{`📋 ${t('notes')}: `}</Text> {group.notes ?? '-'}
      </p>
      <Divider />
      <GroupActionsButtons group={group} />
    </Card>
  );
};
