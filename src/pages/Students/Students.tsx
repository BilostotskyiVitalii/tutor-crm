import { StudentCard, StudentForm } from '@/components';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useState, type FC } from 'react';
import { useGetStudentsQuery } from '@/store/studentsApi';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import type { IStudent } from '@/types/studentTypes';

const Students: FC = () => {
  const { profile } = useAuthProfile();
  const { data: students } = useGetStudentsQuery(profile?.id ?? '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedStudent, setEditedStudent] = useState<IStudent | null>(null);

  const showCreate = () => {
    setIsModalOpen(true);
  };

  const showEdit = (student: IStudent) => {
    setEditedStudent(student);
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    setEditedStudent(null);
  };

  //TODO add spinner on loading, and error handler

  return (
    <>
      <Space direction="vertical" size="large">
        <Space direction="vertical" size="large">
          <h1>Students</h1>
          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={showCreate}>
              New student
            </Button>
          </div>
        </Space>
        <Space size="large" wrap>
          {students?.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              showEdit={showEdit}
            />
          ))}
        </Space>
      </Space>
      <StudentForm
        isModalOpen={isModalOpen}
        onClose={hideModal}
        editedStudent={editedStudent}
      />
    </>
  );
};

export default Students;
