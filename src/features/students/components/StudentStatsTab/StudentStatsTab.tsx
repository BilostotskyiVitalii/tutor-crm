import type { FC } from 'react';

import { CalendarOutlined, CheckOutlined } from '@ant-design/icons';
import { Card, Divider, Space, Statistic } from 'antd';

import type { StudentStatsReq } from '@/features/students/types/studentTypes';
import { formatHours } from '@/shared/utils/formatHours';

import styles from './StudentStatsTab.module.scss';

type Props = {
  stats?: StudentStatsReq;
};

export const StudentStatsTab: FC<Props> = ({ stats }) => (
  <div className={styles.stats}>
    <Card title="Lessons Summary">
      <Space size="large">
        <Statistic
          title="Done"
          value={stats?.doneLessons ?? 0}
          prefix={<CheckOutlined />}
          className={styles.success}
        />
        <Divider type="vertical" />
        <Statistic
          title="Planned"
          value={stats?.plannedLessons ?? 0}
          prefix={<CalendarOutlined />}
          className={styles.planed}
        />
      </Space>
    </Card>

    <Card title="Revenue Summary">
      <Space size="large">
        <Statistic
          title="Total Revenue"
          value={stats?.totalRevenue ?? 0}
          prefix="₴"
        />
        <Divider type="vertical" />
        <Statistic
          title="Total Hours"
          value={stats?.totalHours ?? 0}
          formatter={(val) => formatHours(val as number)}
        />
      </Space>
    </Card>
  </div>
);
