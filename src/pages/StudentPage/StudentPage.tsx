import { useAppSelector } from '@/hooks/reduxHooks';
import { useGetStudentsQuery } from '@/store/studentsApi';
import { Avatar } from 'antd';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';

const StudentPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = useAppSelector((state) => state.user.id);
  const { data: students } = useGetStudentsQuery(userId ?? '');
  const student = students?.find((s) => s.id === id);

  return (
    <>
      <h1>{student?.name}</h1>
      <Avatar
        size={64}
        src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${student?.id}`}
      />
      <p>{student?.email}</p>
      <p>{student?.id}</p>
    </>
  );
};

export default StudentPage;
