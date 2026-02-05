import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { CalendarOutlined, CheckOutlined } from '@ant-design/icons';
import { Card, Divider, Space, Statistic } from 'antd';

import type { GroupStatsReq } from '@/features/groups/types/groupTypes';
import { useFormatHours } from '@/shared/hooks/useFormatHours';

import styles from './GroupStatsTab.module.scss';

type Props = {
  stats?: GroupStatsReq;
};

export const GroupStatsTab: FC<Props> = ({ stats }) => {
  const formatHours = useFormatHours();
  const { t } = useTranslation();

  return (
    <div className={styles.stats}>
      <Card title={t('lessonsSumm')}>
        <Space size="large">
          <Statistic
            title={t('done')}
            value={stats?.doneLessons ?? 0}
            prefix={<CheckOutlined />}
            className={styles.success}
          />
          <Divider type="vertical" />
          <Statistic
            title={t('planed')}
            value={stats?.plannedLessons ?? 0}
            prefix={<CalendarOutlined />}
            className={styles.planed}
          />
        </Space>
      </Card>

      <Card title={t('revSumm')}>
        <Space size="large">
          <Statistic
            title={t('totalRevenue')}
            value={stats?.totalRevenue ?? 0}
            prefix="₴"
          />
          <Divider type="vertical" />
          <Statistic
            title={t('totalHours')}
            value={stats?.totalHours ?? 0}
            formatter={(val) => formatHours(val as number)}
          />
        </Space>
      </Card>
    </div>
  );
};
