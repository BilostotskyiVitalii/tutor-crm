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
        <Text strong>Status: </Text>
        {student.isActive ? (
          <Text type="success">Active</Text>
        ) : (
          <Text type="secondary">Inactive</Text>
        )}
      </p>
      <p>
        <Text strong>Level:</Text> {student.currentLevel ?? '-'}
      </p>
      <p>
        <Text strong>📧 Email: </Text> {student.email ?? '-'}
      </p>
      <p>
        <Text strong>🛜 Contact: </Text> {student.contact ?? '-'}
      </p>
      <p>
        <Text strong>☎️ Phone: </Text> {student.phone ?? '-'}
      </p>
      <p>
        <Text strong>💵 Price per hour: ₴ </Text> {student.price ?? '-'}
      </p>
      <p>
        <Text strong>🎁 Birthdate: </Text>
        {student.birthdate
          ? new Date(student.birthdate).toLocaleDateString()
          : '-'}
      </p>
      <p>
        <Text strong>🍼 Created at: </Text>
        {student.createdAt
          ? new Date(student.createdAt).toLocaleDateString()
          : '-'}
      </p>
      <p>
        <Text strong>📋 Notes: </Text> {student.notes ?? '-'}
      </p>
      <Divider />
      <StudentActionsButtons student={student} />
    </Card>
  );
};
