import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Table } from 'antd';
import { Typography } from 'antd';
import type { SortOrder } from 'antd/es/table/interface';

import type { GroupStatsReq } from '@/features/groups/types/groupTypes';
import type { Lesson } from '@/features/lessons/types/lessonTypes';
import { LessonsByDayChart } from '@/shared/components/UI/LessonsByDayChart/LessonsByDayChart';
import { useFormatHours } from '@/shared/hooks/useFormatHours';

import styles from './GroupLessonsTab.module.scss';

const { Text } = Typography;

type Props = {
  stats?: GroupStatsReq;
};

export const GroupLessonsTab: FC<Props> = ({ stats }) => {
  const formatHours = useFormatHours();
  const { t } = useTranslation();

  const lessonsColumns = [
    {
      title: `${t('date')}`,
      key: 'date',
      render: (_: unknown, l: Lesson) => new Date(l.start).toLocaleDateString(),
      sorter: (a: Lesson, b: Lesson) =>
        new Date(a.start).getTime() - new Date(b.start).getTime(),
      defaultSortOrder: 'ascend' as SortOrder,
    },
    {
      title: `${t('time')}`,
      key: 'time',
      render: (_: unknown, l: Lesson) =>
        new Date(l.start).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      title: `${t('status')}`,
      key: 'status',
      render: (_: unknown, l: Lesson) =>
        new Date(l.end).getTime() <= Date.now() ? (
          <Text type="success">{t('done')}</Text>
        ) : (
          <Text type="warning">{t('planed')}</Text>
        ),
    },
    {
      title: `${t('duration')}`,
      key: 'duration',
      render: (_: unknown, l: Lesson) =>
        formatHours(
          (new Date(l.end).getTime() - new Date(l.start).getTime()) / 3_600_000,
        ),
      sorter: (a: Lesson, b: Lesson) =>
        new Date(a.end).getTime() -
        new Date(a.start).getTime() -
        (new Date(b.end).getTime() - new Date(b.start).getTime()),
    },
    {
      title: `${t('price')}`,
      key: 'price',
      render: (_: unknown, l: Lesson) => (l.price ? `₴ ${l.price}` : '-'),
      sorter: (a: Lesson, b: Lesson) => (a.price ?? 0) - (b.price ?? 0),
    },
  ];

  return (
    <div className={styles.lessons}>
      <Table
        rowKey="id"
        dataSource={stats?.lessons ?? []}
        columns={lessonsColumns}
        pagination={{ pageSize: 10 }}
        size="small"
      />

      <LessonsByDayChart data={stats?.lessonsByDayOfWeek} />
    </div>
  );
};
