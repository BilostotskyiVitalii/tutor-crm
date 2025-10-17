import type { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  TeamOutlined,
  TrophyOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Card,
  Divider,
  Flex,
  List,
  Segmented,
  Spin,
  Statistic,
  Typography,
} from 'antd';

import { useGetDashboardStatsQuery } from '@/features/dashboard/api/dashboardApi';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';

import styles from './DashboardPage.module.scss';

const { Title, Text } = Typography;

const DashboardPage: FC = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const [topMode, setTopMode] = useState<'hours' | 'income'>('hours');
  const [topGroupMode, setTopGroupMode] = useState<'hours' | 'income'>('hours');

  const topList =
    topMode === 'hours'
      ? data?.topStudentsByHours || []
      : data?.topStudentsByIncome || [];

  const topGroupsList =
    topGroupMode === 'hours'
      ? data?.topGroupsByHours || []
      : data?.topGroupsByIncome || [];

  if (isError) {
    return <Alert message="Failed to load dashboard data" type="error" />;
  }

  return (
    <Spin spinning={isLoading}>
      <div className={styles.layoutGrid}>
        <Flex className={styles.leftGrid}>
          <Card className={styles.topStudents}>
            <Flex
              align="center"
              justify="space-between"
              style={{ marginBottom: 16 }}
            >
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

            <List
              dataSource={topList}
              renderItem={(item, index) => (
                <List.Item>
                  <Flex gap="middle" style={{ width: '100%' }}>
                    <Text style={{ fontSize: 28 }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </Text>
                    <Divider
                      type="vertical"
                      style={{ height: '64px', margin: '0 12px' }}
                    />
                    <List.Item.Meta
                      style={{ display: 'flex', alignItems: 'center' }}
                      avatar={
                        <AvatarCustom src={item.avatar} name={item.name} />
                      }
                      title={
                        <Link to={`/students/${item.id}`}>{item.name}</Link>
                      }
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
          <Card className={styles.topGroups}>
            <Flex
              align="center"
              justify="space-between"
              style={{ marginBottom: 16 }}
            >
              <Flex align="center" gap="small">
                <TrophyOutlined style={{ color: '#faad14' }} />
                <Title level={5} style={{ margin: 0 }}>
                  Top Groups
                </Title>
              </Flex>
              <Segmented
                size="small"
                value={topGroupMode}
                onChange={(val) => setTopGroupMode(val as 'hours' | 'income')}
                options={[
                  { label: 'By hours', value: 'hours' },
                  { label: 'By income', value: 'income' },
                ]}
              />
            </Flex>

            <List
              dataSource={topGroupsList}
              renderItem={(item, index) => (
                <List.Item>
                  <Flex gap="middle" style={{ width: '100%' }}>
                    <Text style={{ fontSize: 28 }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </Text>
                    <Divider
                      type="vertical"
                      style={{ height: '64px', margin: '0 12px' }}
                    />
                    <List.Item.Meta
                      style={{ display: 'flex', alignItems: 'center' }}
                      title={
                        <Link to={`/groups/${item.id}`}>{item.title}</Link>
                      }
                      description={
                        topGroupMode === 'hours' ? (
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
        </Flex>

        <div className={styles.rightGrid}>
          {/* Income */}
          <Card title="💰 Month income">
            <Flex justify="space-evenly" gap={12}>
              <Statistic
                title="Current"
                value={data?.currentMonthIncome}
                prefix="$"
                precision={0}
              />
              <Divider type="vertical" style={{ height: '64px' }} />
              <Statistic
                title="Expected"
                value={data?.expectedMonthIncome}
                prefix="$"
                precision={0}
              />
            </Flex>
          </Card>
          <Card title="💸 Average price">
            <Flex justify="space-evenly" gap={12}>
              <Statistic
                title="Hour"
                prefix="$"
                precision={0}
                value={data?.averageHourPrice}
              />
              <Divider type="vertical" style={{ height: '64px' }} />
              <Statistic
                title="Student per/hour"
                prefix="$"
                precision={0}
                value={data?.averagePerHourStudentPrice}
              />
            </Flex>
          </Card>
          {/* Students */}
          <Card title="🧑‍🎓 Students">
            <Flex justify="space-evenly" gap={12}>
              <Statistic
                title="Active"
                value={data?.activeStudents}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
              <Divider type="vertical" style={{ height: '64px' }} />
              <Statistic
                title="New"
                value={data?.newStudents}
                prefix={<UserAddOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Flex>
          </Card>
          {/* Groups */}
          <Card title="🎓 Groups">
            <Flex justify="space-evenly" gap={12}>
              <Statistic
                title="Active groups"
                value={data?.activeGroups}
                prefix={<TeamOutlined />}
              />
              <Divider type="vertical" style={{ height: '64px' }} />
              <Statistic
                title="Active groups"
                value={data?.newGroups}
                prefix={<UsergroupAddOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Flex>
          </Card>

          {/* Lessons */}
          <Card title="📚 Lessons">
            <Flex justify="space-evenly" gap={12}>
              <Statistic title="Done" value={data?.doneLessons} />
              <Divider type="vertical" style={{ height: '64px' }} />
              <Statistic title="Planned" value={data?.plannedLessons} />
            </Flex>
          </Card>
        </div>
      </div>
    </Spin>
  );
};

export default DashboardPage;
