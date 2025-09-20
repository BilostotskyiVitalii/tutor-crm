import { useAuthProfile } from '@/hooks/useAuthProfile';
import { useGetStudentsQuery } from '@/store/studentsApi';
import { Avatar } from 'antd';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';

const StudentPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuthProfile();
  const { data: students } = useGetStudentsQuery(profile?.id ?? '');
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
