import { useGetStudentsQuery } from '@/store/studentsApi';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';

const StudentPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: students } = useGetStudentsQuery();
  const student = students?.find((s) => s.id === id);

  return (
    <>
      <h1>{student?.name}</h1>
      <p>{student?.email}</p>
      <p>{student?.id}</p>
    </>
  );
};

export default StudentPage;
