import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { TrophyOutlined } from '@ant-design/icons';
import { Card, Divider, Flex, List, Segmented } from 'antd';
import Title from 'antd/es/typography/Title';

import { useGetDashboardStatsQuery } from '@/features/dashboard/api/dashboardApi';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';

interface TopStudentsCardProps {
  range: {
    start: string;
    end: string;
  };
}

export const TopStudentsCard: FC<TopStudentsCardProps> = ({ range }) => {
  const { data } = useGetDashboardStatsQuery(range);
  const [topMode, setTopMode] = useState<'hours' | 'revenue'>('hours');
  const topList =
    topMode === 'hours'
      ? data?.topStudentsByHours || []
      : data?.topStudentsByRevenue || [];

  return (
    <Card
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
            onChange={(val) => setTopMode(val as 'hours' | 'revenue')}
            options={[
              { label: 'By hours', value: 'hours' },
              { label: 'By revenue', value: 'revenue' },
            ]}
          />
        </Flex>
      }
    >
      <List
        dataSource={topList}
        renderItem={(item, index) => (
          <List.Item>
            <Flex gap="middle" style={{ width: '100%' }}>
              <span style={{ fontSize: 28 }}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </span>
              <Divider type="vertical" />
              <List.Item.Meta
                style={{ display: 'flex', alignItems: 'center' }}
                avatar={<AvatarCustom src={item.avatar} name={item.name} />}
                title={<Link to={`/students/${item.id}`}>{item.name}</Link>}
                description={
                  topMode === 'hours' ? (
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
