import type { FC } from 'react';

import {
  DollarOutlined,
  GroupOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Card, Flex, Spin, Statistic } from 'antd';

import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';

const DashboardPage: FC = () => {
  const { data, isLoading, isError } = useDashboardData();

  if (isLoading) {
    return <Spin tip="Loading dashboard..." />;
  }
  if (isError) {
    return <Alert message="Failed to load dashboard data" type="error" />;
  }

  return (
    <Flex wrap gap="large">
      <Card variant="borderless" title="Students">
        <Statistic
          title="Active students"
          value={data.activeStudents}
          valueStyle={{ color: '#3f8600' }}
          prefix={<UserOutlined />}
        />
        <Statistic
          title="New students this month"
          value={data.newStudents}
          valueStyle={{ color: '#3f8600' }}
          prefix={<UserOutlined />}
        />
      </Card>

      <Card variant="borderless" title="Groups">
        <Statistic
          title="Active groups"
          value={data.activeGroups}
          prefix={<GroupOutlined />}
        />
      </Card>

      <Card variant="borderless" title="Lessons">
        <Statistic title="Done this month" value={data.doneLessons} />
        <Statistic title="Planned this month" value={data.plannedLessons} />
      </Card>

      <Card variant="borderless" title="Prices">
        <Statistic
          title="Avg lesson price"
          prefix="$"
          value={data.avgLessonPrice}
        />
        <Statistic
          title="Total revenue (month)"
          prefix="$"
          value={data.totalRevenue}
        />
      </Card>

      <Card variant="borderless" title="Top students">
        <Statistic
          title="By hours"
          value={data.topByLessons}
          prefix={<TrophyOutlined />}
        />
        <Statistic
          title="By $"
          value={data.topByRevenue}
          prefix={<DollarOutlined />}
        />
      </Card>
    </Flex>
  );
};

export default DashboardPage;
