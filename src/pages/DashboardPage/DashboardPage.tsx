import type { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  DollarOutlined,
  GroupOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Card,
  Flex,
  List,
  Segmented,
  Spin,
  Statistic,
  Typography,
} from 'antd';

import { useGetDashboardStatsQuery } from '@/features/dashboard/api/dashboardApi';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';

const { Title, Text } = Typography;

const DashboardPage: FC = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const [topMode, setTopMode] = useState<'hours' | 'income'>('hours');
  const topList =
    topMode === 'hours'
      ? data?.topStudentsByHours || []
      : data?.topStudentsByIncome || [];

  if (isError) {
    return <Alert message="Failed to load dashboard data" type="error" />;
  }

  return (
    <Spin spinning={isLoading}>
      <Flex wrap gap="large" justify="start" align="stretch">
        {/* Students */}
        <Card title="👩‍🎓 Students" style={{ width: 280 }}>
          <Statistic
            title="Active students"
            value={data?.activeStudents}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
          <Statistic
            title="New this month"
            value={data?.newStudents}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>

        {/* Top Students */}
        <Card
          style={{ minWidth: 400 }}
          title={
            <Flex align="center" justify="space-between">
              <Flex align="center" gap="small">
                <TrophyOutlined style={{ color: '#faad14' }} />
                <Title level={5} style={{ margin: 0 }}>
                  Top Students
                </Title>
              </Flex>
              <Segmented
                size="small"
                value={topMode}
                onChange={(val) => setTopMode(val as 'hours' | 'income')}
                options={[
                  { label: 'By hours', value: 'hours' },
                  { label: 'By income', value: 'income' },
                ]}
              />
            </Flex>
          }
        >
          <List
            // itemLayout="horizontal"
            dataSource={topList}
            renderItem={(item, index) => (
              <List.Item>
                <Flex gap="middle" style={{ width: '100%' }}>
                  <Text style={{ fontSize: 30 }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </Text>
                  <List.Item.Meta
                    style={{ display: 'flex', alignItems: 'center' }}
                    avatar={<AvatarCustom src={item.avatar} name={item.name} />}
                    title={<Link to={`/students/${item.id}`}>{item.name}</Link>}
                    description={
                      topMode === 'hours' ? (
                        <Text type="secondary">
                          {item.totalHours.toFixed(0)} h
                        </Text>
                      ) : (
                        <Text type="secondary">
                          ${item.totalRevenue.toFixed(0)}
                        </Text>
                      )
                    }
                  />
                </Flex>
              </List.Item>
            )}
          />
        </Card>

        {/* Groups */}
        <Card title="👥 Groups" style={{ width: 280 }}>
          <Statistic
            title="Active groups"
            value={data?.activeGroups}
            prefix={<GroupOutlined />}
          />
        </Card>

        {/* Lessons */}
        <Card title="📘 Lessons" style={{ width: 280 }}>
          <Statistic title="Done this month" value={data?.doneLessons} />
          <Statistic title="Planned this month" value={data?.plannedLessons} />
        </Card>

        {/* Income */}
        <Card title="💰 Month income" style={{ width: 280 }}>
          <Statistic
            title="Current"
            value={data?.currentMonthIncome}
            prefix="$"
            precision={0}
          />
          <Statistic
            title="Expected"
            value={data?.expectedMonthIncome}
            prefix="$"
            precision={0}
          />
        </Card>

        {/* Average Prices */}
        <Card title="📈 Average price" style={{ width: 280 }}>
          <Statistic
            title="Per lesson"
            prefix="$"
            precision={0}
            value={data?.avgLessonPrice}
          />
          <Statistic
            title="Per hour"
            prefix="$"
            precision={0}
            value={data?.averageHourPrice}
          />
          <Statistic
            title="Per student/hour"
            prefix="$"
            precision={0}
            value={data?.averagePerHourStudentPrice}
          />
        </Card>
      </Flex>
    </Spin>
  );
};

export default DashboardPage;
