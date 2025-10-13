import type { FC } from 'react';
import { useParams } from 'react-router-dom';

const StudentIdPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  return <h1>{id}</h1>;
};

export default StudentIdPage;
