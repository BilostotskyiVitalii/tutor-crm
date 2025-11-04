import type { FC } from 'react';

import { Card, Divider, Typography } from 'antd';

import { StudentActionsButtons } from '@/features/students/components/StudentActionsButtons/StudentActionsButtons';
import type { Student } from '@/features/students/types/studentTypes';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';

import styles from './StudentInfoCard.module.scss';

const { Text } = Typography;

type Props = {
  student: Student;
};

export const StudentInfoCard: FC<Props> = ({ student }) => {
  return (
    <Card className={styles.studentCard}>
      <AvatarCustom
        src={student.avatarUrl || null}
        name={student.name}
        inactive={student.isActive}
        className={styles.avatar}
      />
      <Divider />
      <h2>{student.name}</h2>
      <p>
        Status:{' '}
        {student.isActive ? (
          <Text type="success">Active</Text>
        ) : (
          <Text type="secondary">Inactive</Text>
        )}
      </p>
      <p>Level: {student.currentLevel ?? '-'}</p>
      <p>📧 Email: {student.email ?? '-'}</p>
      <p>🛜 Contact: {student.contact ?? '-'}</p>
      <p>☎️ Phone: {student.phone ?? '-'}</p>
      <p>💵 Price per hour: ₴ {student.price ?? '-'}</p>
      <p>
        🎁 Birthdate:{' '}
        {student.birthdate
          ? new Date(student.birthdate).toLocaleDateString()
          : '-'}
      </p>
      <p>
        🍼 Created at:{' '}
        {student.createdAt
          ? new Date(student.createdAt).toLocaleDateString()
          : '-'}
      </p>
      <p>📋 Notes: {student.notes ?? '-'}</p>
      <Divider />
      <StudentActionsButtons student={student} />
    </Card>
  );
};
