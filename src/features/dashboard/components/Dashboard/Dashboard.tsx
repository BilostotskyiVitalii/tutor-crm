import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import { TopListCard } from '@/features/dashboard/components/TopListCard/TopListCard';
import { DateRangePicker } from '@/shared/components/UI/DateRangePicker/DateRangePicker';
import { LessonsByDayChart } from '@/shared/components/UI/LessonsByDayChart/LessonsByDayChart';

import styles from './Dashboard.module.scss';

export const Dashboard = () => {
  const [queryParams, setQueryParams] = useState({
    start: dayjs().startOf('month').toISOString(),
    end: dayjs().endOf('month').toISOString(),
  });
  const { t } = useTranslation();

  const { data, isLoading, isError } = useGetDashboardStatsQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  if (isError) {
    return <Alert message={t('failedLoad')} type="error" />;
  }

  return (
    <Spin spinning={isLoading}>
      <div className={styles.wrapper}>
        <DateRangePicker onApply={setQueryParams} range={queryParams} />
        <div className={styles.content}>
          <div className={styles.layoutGrid}>
            <div className={styles.leftGrid}>
              <TopListCard
                title={t('topStudents')}
                data={{
                  hours: data?.topStudentsByHours ?? [],
                  revenue: data?.topStudentsByRevenue ?? [],
                }}
              />
              <TopListCard
                title={t('topGroups')}
                data={{
                  hours: data?.topGroupsByHours ?? [],
                  revenue: data?.topGroupsByRevenue ?? [],
                }}
              />
              <PieRevenueMix
                data={{
                  current: data?.revenueMixCurrent,
                  expected: data?.revenueMixExpected,
                }}
              />
              <LessonsByDayChart
                data={data?.lessonsByDayOfWeek}
                title={`${t('lessonsByDay')}`}
              />
            </div>
            <div className={styles.rightGrid}>
              <Card title={`💰 ${t('revenue')}`}>
                <div className={styles.cardContainer}>
                  <Statistic
                    title={`💰 ${t('current')}`}
                    value={data?.currentMonthRevenue}
                    prefix="₴"
                    precision={0}
                  />
                  <Divider type="vertical" />
                  <Statistic
                    title={`💰 ${t('expected')}`}
                    value={data?.expectedMonthRevenue}
                    prefix="₴"
                    precision={0}
                  />
                </div>
              </Card>
              <Card title={`💸 ${t('avgPrice')}`}>
                <div className={styles.cardContainer}>
                  <Statistic
                    title={t('perHour')}
                    prefix="₴"
                    precision={0}
                    value={data?.averageHourPrice}
                  />
                  <Divider type="vertical" />
                  <Statistic
                    title={t('studentPerHour')}
                    prefix="₴"
                    precision={0}
                    value={data?.averagePerHourStudentPrice}
                  />
                </div>
              </Card>
              <Card title={`🧑‍🎓 ${t('students')}`}>
                <div className={styles.cardContainer}>
                  <Statistic
                    title={t('active')}
                    value={data?.activeStudents}
                    prefix={<UserOutlined />}
                  />
                  <Divider type="vertical" />
                  <Statistic
                    title={t('new')}
                    value={data?.newStudents}
                    prefix={<UserAddOutlined />}
                    className={styles.success}
                  />
                </div>
              </Card>
              <Card title={`🎓 ${t('groups')}`}>
                <div className={styles.cardContainer}>
                  <Statistic
                    title={t('active')}
                    value={data?.activeGroups}
                    prefix={<TeamOutlined />}
                  />
                  <Divider type="vertical" />
                  <Statistic
                    title={t('new')}
                    value={data?.newGroups}
                    prefix={<UsergroupAddOutlined />}
                    className={styles.success}
                  />
                </div>
              </Card>
              <Card title={`📚 ${t('lessons')}`}>
                <div className={styles.cardContainer}>
                  <Statistic
                    title={t('done')}
                    value={data?.doneLessons}
                    prefix={<CheckOutlined />}
                    className={styles.success}
                  />
                  <Divider type="vertical" />
                  <Statistic
                    title={t('planed')}
                    value={data?.plannedLessons}
                    prefix={<CalendarOutlined />}
                    className={styles.planed}
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
