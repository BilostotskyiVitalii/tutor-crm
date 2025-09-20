import { StudentCard, StudentForm } from '@/components';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useState, type FC } from 'react';
import { useGetStudentsQuery } from '@/store/studentsApi';

const Students: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: students } = useGetStudentsQuery();
  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  //TODO add spinner on loading, and error handler

  return (
    <>
      <Space direction="vertical" size="large">
        <Space direction="vertical" size="large">
          <h1>Students</h1>
          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              New student
            </Button>
          </div>
        </Space>
        <Space size="large" wrap>
          {students?.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </Space>
      </Space>
      <StudentForm isModalOpen={isModalOpen} onClose={hideModal} />
    </>
  );
};

export default Students;
