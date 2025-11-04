import type { FC } from 'react';

import { Button, Card, DatePicker, Space, Spin, Tabs } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

import { StudentInfoCard } from '@/features/students/components/StudentInfoCard/StudentInfoCard';
import { StudentLessonsTab } from '@/features/students/components/StudentLessonsTab/StudentLessonsTab';
import { StudentStatsTab } from '@/features/students/components/StudentStatsTab/StudentStatsTab';
import { useStudentIdPage } from '@/features/students/hooks/useStudentIdPage';

import styles from './StudentIdPage.module.scss';

const { RangePicker } = DatePicker;

const StudentIdPage: FC = () => {
  const {
    student,
    stats,
    studentLoading,
    statsLoading,
    dateRange,
    handleDateChange,
    applyDateFilter,
  } = useStudentIdPage();

  if (!student && !studentLoading) {
    return <div>Student not found</div>;
  }

  return (
    <Spin spinning={studentLoading || statsLoading}>
      <div className={styles.wrapper}>
        {student && <StudentInfoCard student={student} />}

        <section className={styles.rightSection}>
          <Card title="Select Period">
            <Space>
              <RangePicker
                value={dateRange}
                onChange={handleDateChange as RangePickerProps['onChange']}
                allowClear
                format="DD.MM.YYYY"
              />
              <Button type="primary" onClick={applyDateFilter}>
                Apply
              </Button>
            </Space>
          </Card>

          <Tabs
            defaultActiveKey="stats"
            items={[
              {
                key: 'stats',
                label: '📊 Stats',
                children: <StudentStatsTab stats={stats} />,
              },
              {
                key: 'lessons',
                label: '📘 Lessons',
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
