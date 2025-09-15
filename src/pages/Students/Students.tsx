import StudentCard from '@/components/StudentCard/StudentCard';
import { Space } from 'antd';

import type { FC } from 'react';

const Students: FC = () => {
  return (
    <>
      <h1 className="pageTitle">Students</h1>
      <Space size="large" wrap>
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
      </Space>
    </>
  );
};

export default Students;
