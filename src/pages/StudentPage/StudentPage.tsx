import type { FC } from 'react';
import { useParams } from 'react-router-dom';

import { Avatar } from 'antd';

import { useGetStudentsQuery } from '@/store/studentsApi';
import { getAvatarColorClass } from '@/utils/getAvatarColorClass';

import styles from './StudentPage.module.scss';

const StudentPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: students } = useGetStudentsQuery();
  const student = students?.find((s) => s.id === id);

  return (
    <>
      <h1>{student?.name}</h1>
      <Avatar
        size={120}
        src={student?.avatarUrl}
        className={`${styles.avatar} ${styles[getAvatarColorClass(student?.name ?? '')]}`}
      >
        {student?.name[0]}
      </Avatar>
      <p>{student?.email}</p>
      <p>{student?.id}</p>
    </>
  );
};

export default StudentPage;
