import type { FC } from 'react';
import { useParams } from 'react-router-dom';

import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';

const StudentIdPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: students } = useGetStudentsQuery();
  const student = students?.find((s) => s.id === id);

  return (
    <>
      <h1>{student?.name}</h1>
      <AvatarCustom
        src={student?.avatarUrl ?? null}
        name={student?.name ?? ''}
        inactive
      />
      <p>{student?.email}</p>
      <p>{student?.id}</p>
    </>
  );
};

export default StudentIdPage;
