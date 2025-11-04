import type { FC } from 'react';

import {
  CalendarOutlined,
  CheckOutlined,
  TeamOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Card, Divider, Flex, Spin, Statistic } from 'antd';

import { useGetDashboardStatsQuery } from '@/features/dashboard/api/dashboardApi';
import PieRevenueMix from '@/features/dashboard/components/PieRevenueMix/PieRevenueMix';
import { TopGroupsCard } from '@/features/dashboard/components/TopGroupsCard/TopGroupsCard';
import { TopStudentsCard } from '@/features/dashboard/components/TopStudentsCard/TopStudentsCard';

import styles from './Dashboard.module.scss';

export const Dashboard: FC = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isError) {
    return <Alert message="Failed to load dashboard data" type="error" />;
  }

  return (
    <Spin spinning={isLoading}>
      <div className={styles.layoutGrid}>
        <div className={styles.leftGrid}>
          <TopStudentsCard />
          <TopGroupsCard />
          <PieRevenueMix />
        </div>
        <div className={styles.rightGrid}>
          <Card title="💰 Month revenue">
            <Flex justify="space-evenly" gap={12}>
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
            </Flex>
          </Card>
          <Card title="💸 Average price">
            <Flex justify="space-evenly" gap={12}>
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
            </Flex>
          </Card>
          <Card title="🧑‍🎓 Students">
            <Flex justify="space-evenly" gap={12}>
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
            </Flex>
          </Card>
          <Card title="🎓 Groups">
            <Flex justify="space-evenly" gap={12}>
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
            </Flex>
          </Card>
          <Card title="📚 Lessons">
            <Flex justify="space-evenly" gap={12}>
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
            </Flex>
          </Card>
        </div>
      </div>
    </Spin>
  );
};
