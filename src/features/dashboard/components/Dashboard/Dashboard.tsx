import { type FC, useState } from 'react';

import {
  CalendarOutlined,
  CheckOutlined,
  TeamOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Card, Divider, Spin, Statistic } from 'antd';
import dayjs from 'dayjs';

import { useGetDashboardStatsQuery } from '@/features/dashboard/api/dashboardApi';
import PieRevenueMix from '@/features/dashboard/components/PieRevenueMix/PieRevenueMix';
import { TopGroupsCard } from '@/features/dashboard/components/TopGroupsCard/TopGroupsCard';
import { TopStudentsCard } from '@/features/dashboard/components/TopStudentsCard/TopStudentsCard';
import { DateRangePicker } from '@/shared/components/UI/DateRangePicker/DateRangePicker';
import { LessonsByDayChart } from '@/shared/components/UI/LessonsByDayChart/LessonsByDayChart';

import styles from './Dashboard.module.scss';

export const Dashboard: FC = () => {
  const [queryParams, setQueryParams] = useState({
    start: dayjs().startOf('month').toISOString(),
    end: dayjs().endOf('month').toISOString(),
  });

  const { data, isLoading, isError } = useGetDashboardStatsQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  if (isError) {
    return <Alert message="Failed to load dashboard data" type="error" />;
  }

  return (
    <Spin spinning={isLoading}>
      <div className={styles.wrapper}>
        <DateRangePicker onApply={setQueryParams} range={queryParams} />
        <div className={styles.content}>
          <div className={styles.layoutGrid}>
            <div className={styles.leftGrid}>
              <TopStudentsCard range={queryParams} />
              <TopGroupsCard range={queryParams} />
              <PieRevenueMix range={queryParams} />
              <LessonsByDayChart data={data?.lessonsByDayOfWeek} />
            </div>
            <div className={styles.rightGrid}>
              <Card title="💰 Revenue">
                <div className={styles.cardContainer}>
                  <Statistic
                    title="Current"
                    value={data?.currentMonthRevenue}
                    prefix="$"
                    precision={0}
                  />
                  <Divider type="vertical" />
                  <Statistic
                    title="Expected"
                    value={data?.expectedMonthRevenue}
                    prefix="$"
                    precision={0}
                  />
                </div>
              </Card>
              <Card title="💸 Average price">
                <div className={styles.cardContainer}>
                  <Statistic
                    title="Per/hour"
                    prefix="$"
                    precision={0}
                    value={data?.averageHourPrice}
                  />
                  <Divider type="vertical" />
                  <Statistic
                    title="Student per/hour"
                    prefix="$"
                    precision={0}
                    value={data?.averagePerHourStudentPrice}
                  />
                </div>
              </Card>
              <Card title="🧑‍🎓 Students">
                <div className={styles.cardContainer}>
                  <Statistic
                    title="Active"
                    value={data?.activeStudents}
                    prefix={<UserOutlined />}
                  />
                  <Divider type="vertical" />
                  <Statistic
                    title="New"
                    value={data?.newStudents}
                    prefix={<UserAddOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </div>
              </Card>
              <Card title="🎓 Groups">
                <div className={styles.cardContainer}>
                  <Statistic
                    title="Active"
                    value={data?.activeGroups}
                    prefix={<TeamOutlined />}
                  />
                  <Divider type="vertical" />
                  <Statistic
                    title="New"
                    value={data?.newGroups}
                    prefix={<UsergroupAddOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </div>
              </Card>
              <Card title="📚 Lessons">
                <div className={styles.cardContainer}>
                  <Statistic
                    title="Done"
                    value={data?.doneLessons}
                    prefix={<CheckOutlined />}
                  />
                  <Divider type="vertical" />
                  <Statistic
                    title="Planned"
                    value={data?.plannedLessons}
                    prefix={<CalendarOutlined />}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};
