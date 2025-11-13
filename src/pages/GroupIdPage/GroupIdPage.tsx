import { type FC, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Empty, Spin, Tabs } from 'antd';
import dayjs from 'dayjs';

import {
  useGetGroupByIdQuery,
  useGetGroupStatsQuery,
} from '@/features/groups/api/groupsApi';
import { GroupInfoCard } from '@/features/groups/components/GroupInfoCard/GroupInfoCard';
import { GroupLessonsTab } from '@/features/groups/components/GroupLessonsTab/GroupLessonsTab';
import { GroupStatsTab } from '@/features/groups/components/GroupStatsTab/GroupStatsTab';
import { DateRangePicker } from '@/shared/components/UI/DateRangePicker/DateRangePicker';

import styles from './GroupIdPage.module.scss';

const GroupIdPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  const defaultStart = dayjs().startOf('month');
  const defaultEnd = dayjs().endOf('month');

  const [queryParams, setQueryParams] = useState({
    start: defaultStart.toISOString(),
    end: defaultEnd.toISOString(),
  });

  const { data: group, isLoading: groupLoading } = useGetGroupByIdQuery(
    id || '',
  );

  const { data: stats, isLoading: statsLoading } = useGetGroupStatsQuery(
    { id: id || '', ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  if (!group && !groupLoading) {
    return <Empty description={'Group not found'} />;
  }

  return (
    <Spin spinning={groupLoading || statsLoading}>
      <div className={styles.wrapper}>
        {group && <GroupInfoCard group={group} />}

        <section className={styles.rightSection}>
          <DateRangePicker onApply={setQueryParams} range={queryParams} />

          <Tabs
            defaultActiveKey="stats"
            items={[
              {
                key: 'stats',
                label: '📊 Stats',
                children: <GroupStatsTab stats={stats} />,
              },
              {
                key: 'lessons',
                label: '📘 Lessons',
                children: <GroupLessonsTab stats={stats} />,
              },
            ]}
          />
        </section>
      </div>
    </Spin>
  );
};

export default GroupIdPage;
