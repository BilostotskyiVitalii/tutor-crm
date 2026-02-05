import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Empty, Spin, Tabs } from 'antd';
import dayjs from 'dayjs';

import {
  useGetStudentByIdQuery,
  useGetStudentStatsQuery,
} from '@/features/students/api/studentsApi';
import { StudentInfoCard } from '@/features/students/components/StudentInfoCard/StudentInfoCard';
import { StudentLessonsTab } from '@/features/students/components/StudentLessonsTab/StudentLessonsTab';
import { StudentStatsTab } from '@/features/students/components/StudentStatsTab/StudentStatsTab';
import { DateRangePicker } from '@/shared/components/UI/DateRangePicker/DateRangePicker';

import styles from './StudentIdPage.module.scss';

const StudentIdPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const defaultStart = dayjs().startOf('month');
  const defaultEnd = dayjs().endOf('month');

  const [queryParams, setQueryParams] = useState({
    start: defaultStart.toISOString(),
    end: defaultEnd.toISOString(),
  });

  const { data: student, isLoading: studentLoading } = useGetStudentByIdQuery(
    id || '',
  );

  const { data: stats, isLoading: statsLoading } = useGetStudentStatsQuery(
    { id: id || '', ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  if (!student && !studentLoading) {
    return <Empty description={t('noStudent')} />;
  }

  return (
    <Spin spinning={studentLoading || statsLoading}>
      <div className={styles.wrapper}>
        {student && <StudentInfoCard student={student} />}

        <section className={styles.rightSection}>
          <DateRangePicker onApply={setQueryParams} range={queryParams} />

          <Tabs
            defaultActiveKey="stats"
            items={[
              {
                key: 'stats',
                label: `📊 ${t('stats')}`,
                children: <StudentStatsTab stats={stats} />,
              },
              {
                key: 'lessons',
                label: `📘 ${t('lessons')}`,
                children: <StudentLessonsTab stats={stats} />,
              },
            ]}
          />
        </section>
      </div>
    </Spin>
  );
};

export default StudentIdPage;
