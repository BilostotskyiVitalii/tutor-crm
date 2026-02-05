import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { TrophyOutlined } from '@ant-design/icons';
import { Card, Divider, Flex, List, Segmented } from 'antd';
import Title from 'antd/es/typography/Title';

import type {
  GroupStat,
  StudentStat,
} from '@/features/dashboard/types/dashboardStats';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';

import styles from './TopListCard.module.scss';

type TopItem = GroupStat | StudentStat;

interface TopListCardProps {
  title: string;
  data?: {
    hours: (GroupStat | StudentStat)[];
    revenue: (GroupStat | StudentStat)[];
  };
}

function isStudent(item: TopItem): item is StudentStat {
  return 'name' in item;
}

export const TopListCard: FC<TopListCardProps> = ({ title, data }) => {
  const [mode, setMode] = useState<'hours' | 'revenue'>('hours');
  const list = mode === 'hours' ? data?.hours : data?.revenue;
  const { t } = useTranslation();

  return (
    <Card
      title={
        <Flex align="center" justify="space-between">
          <Flex align="center" gap="small">
            <TrophyOutlined className={styles.icon} />
            <Title level={5} className={styles.title}>
              {title}
            </Title>
          </Flex>

          <Segmented
            size="small"
            value={mode}
            onChange={(val) => setMode(val as 'hours' | 'revenue')}
            options={[
              { label: `${t('byHours')}`, value: 'hours' },
              { label: `${t('byRevenue')}`, value: 'revenue' },
            ]}
          />
        </Flex>
      }
    >
      <List<TopItem>
        dataSource={list}
        renderItem={(item, index) => (
          <List.Item>
            <Flex gap="middle" className={styles.row}>
              <span className={styles.medal}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </span>

              <Divider type="vertical" />

              <List.Item.Meta
                avatar={
                  isStudent(item) ? (
                    <AvatarCustom src={item.avatar} name={item.name} />
                  ) : undefined
                }
                title={
                  <Link
                    to={
                      isStudent(item)
                        ? `/students/${item.id}`
                        : `/groups/${item.id}`
                    }
                  >
                    {isStudent(item) ? item.name : item.title}
                  </Link>
                }
                description={
                  mode === 'hours'
                    ? `${item.totalHours.toFixed(0)} h`
                    : `$${item.totalRevenue.toFixed(0)}`
                }
              />
            </Flex>
          </List.Item>
        )}
      />
    </Card>
  );
};
