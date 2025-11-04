import { useState } from 'react';
import { Link } from 'react-router-dom';

import { TrophyOutlined } from '@ant-design/icons';
import { Card, Divider, Flex, List, Segmented } from 'antd';
import Title from 'antd/es/typography/Title';

import { useGetDashboardStatsQuery } from '@/features/dashboard/api/dashboardApi';

export const TopGroupsCard = () => {
  const { data } = useGetDashboardStatsQuery();
  const [topGroupMode, setTopGroupMode] = useState<'hours' | 'revenue'>(
    'hours',
  );

  const topGroupsList =
    topGroupMode === 'hours'
      ? data?.topGroupsByHours || []
      : data?.topGroupsByRevenue || [];

  return (
    <Card
      title={
        <Flex align="center" justify="space-between">
          <Flex align="center" gap="small">
            <TrophyOutlined style={{ color: '#faad14' }} />
            <Title level={5} style={{ margin: 0 }}>
              Top Groups
            </Title>
          </Flex>
          <Segmented
            size="small"
            value={topGroupMode}
            onChange={(val) => setTopGroupMode(val as 'hours' | 'revenue')}
            options={[
              { label: 'By hours', value: 'hours' },
              { label: 'By revenue', value: 'revenue' },
            ]}
          />
        </Flex>
      }
    >
      <List
        dataSource={topGroupsList}
        renderItem={(item, index) => (
          <List.Item>
            <Flex gap="middle" style={{ width: '100%' }}>
              <span style={{ fontSize: 28 }}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </span>
              <Divider type="vertical" />
              <List.Item.Meta
                style={{ display: 'flex', alignItems: 'center' }}
                title={<Link to={`/groups/${item.id}`}>{item.title}</Link>}
                description={
                  topGroupMode === 'hours' ? (
                    <span>{item.totalHours.toFixed(0)} h</span>
                  ) : (
                    <span>${item.totalRevenue.toFixed(0)}</span>
                  )
                }
              />
            </Flex>
          </List.Item>
        )}
      />
    </Card>
  );
};
