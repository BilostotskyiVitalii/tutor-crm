import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Table } from 'antd';

import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { useStudentColumns } from '@/features/students/hooks/useStudentColumns';
import { useModal } from '@/shared/providers/ModalProvider';

import styles from './StudentsPage.module.scss';

const StudentsPage: FC = () => {
  const { data: students, isLoading, isError } = useGetStudentsQuery();
  const { openModal } = useModal();
  const columns = useStudentColumns();
  const { t } = useTranslation();

  function onAddStudent() {
    openModal({
      type: 'student',
      mode: 'create',
      entity: null,
    });
  }

  return (
    <Flex className={styles.wrapper}>
      <Button type="primary" icon={<PlusOutlined />} onClick={onAddStudent}>
        {t('newStudent')}
      </Button>

      {isError && <p style={{ color: 'red' }}>{t('failedLoadStudents')}</p>}

      <Table
        className={styles.studentsDesktop}
        rowKey="id"
        columns={columns}
        dataSource={students}
        pagination={{ pageSize: 30, position: ['bottomCenter'] }}
        loading={isLoading}
        locale={{ emptyText: <Empty description={t('noStudent')} /> }}
        size="small"
      />
    </Flex>
  );
};

export default StudentsPage;
