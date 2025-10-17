import type { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { GroupOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
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

  const topList =
    topMode === 'hours'
      ? data?.topStudentsByHours || []
      : data?.topStudentsByIncome || [];

  if (isError) {
    return <Alert message="Failed to load dashboard data" type="error" />;
  }

  return (
    <Spin spinning={isLoading}>
      {/* Top Students */}
      <Flex gap={12} wrap>
        <div className={styles.topstudentsWrapper}>
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
        </div>
        <div className={styles.masonryContainer}>
          {/* Students */}
          <Card className={`${styles.masonryItem} ${styles.students}`}>
            <Statistic
              title="Active"
              value={data?.activeStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
          <Card className={`${styles.masonryItem} ${styles.students}`}>
            <Statistic
              title="New"
              value={data?.newStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>

          {/* Groups */}
          <Card className={`${styles.masonryItem} ${styles.groups}`}>
            <Statistic
              title="Active groups"
              value={data?.activeGroups}
              prefix={<GroupOutlined />}
            />
          </Card>

          {/* Lessons */}
          <Card className={`${styles.masonryItem} ${styles.lessons}`}>
            <Statistic title="Done" value={data?.doneLessons} />
          </Card>
          <Card className={`${styles.masonryItem} ${styles.lessons}`}>
            <Statistic title="Planned" value={data?.plannedLessons} />
          </Card>

          {/* Income */}
          <Card className={`${styles.masonryItem} ${styles.income}`}>
            <Statistic
              title="Current"
              value={data?.currentMonthIncome}
              prefix="$"
              precision={0}
            />
          </Card>
          <Card className={`${styles.masonryItem} ${styles.income}`}>
            <Statistic
              title="Expected"
              value={data?.expectedMonthIncome}
              prefix="$"
              precision={0}
            />
          </Card>

          {/* Average Prices */}
          <Card className={`${styles.masonryItem} ${styles.prices}`}>
            <Statistic
              title="Lesson"
              prefix="$"
              precision={0}
              value={data?.avgLessonPrice}
            />
          </Card>
          <Card className={`${styles.masonryItem} ${styles.prices}`}>
            <Statistic
              title="Hour"
              prefix="$"
              precision={0}
              value={data?.averageHourPrice}
            />
          </Card>
          <Card className={`${styles.masonryItem} ${styles.prices}`}>
            <Statistic
              title="Student per/hour"
              prefix="$"
              precision={0}
              value={data?.averagePerHourStudentPrice}
            />
          </Card>
        </div>
      </Flex>
    </Spin>
  );
};

export default DashboardPage;
