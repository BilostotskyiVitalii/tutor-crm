import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
        <Text strong>{`${t('status')}: `}</Text>
        {student.isActive ? (
          <Text type="success">{t('active')}</Text>
        ) : (
          <Text type="secondary">{t('inActive')}</Text>
        )}
      </p>
      <p>
        <Text strong>{t('level')}</Text> {student.currentLevel ?? '-'}
      </p>
      <p>
        <Text strong>{`📧 ${t('email')}`}</Text> {student.email ?? '-'}
      </p>
      <p>
        <Text strong>{`🛜 ${t('contact')}`}</Text> {student.contact ?? '-'}
      </p>
      <p>
        <Text strong>{`☎️ ${t('phone')}`}</Text> {student.phone ?? '-'}
      </p>
      <p>
        <Text strong>{`💵 ${t('pricePH')}: ₴`}</Text> {student.price ?? '-'}
      </p>
      <p>
        <Text strong>{`🎁 ${t('birthdate')} `}</Text>
        {student.birthdate
          ? new Date(student.birthdate).toLocaleDateString()
          : '-'}
      </p>
      <p>
        <Text strong>{`🍼 ${t('createdAt')}: `}</Text>
        {student.createdAt
          ? new Date(student.createdAt).toLocaleDateString()
          : '-'}
      </p>
      <p>
        <Text strong>{`📋 ${t('notes')}: `}</Text> {student.notes ?? '-'}
      </p>
      <Divider />
      <StudentActionsButtons student={student} />
    </Card>
  );
};
