import type { FC } from 'react';

import { Table } from 'antd';
import type { SortOrder } from 'antd/es/table/interface';

import type { Lesson } from '@/features/lessons/types/lessonTypes';
import type { StudentStatsReq } from '@/features/students/types/studentTypes';
import { LessonsByDayChart } from '@/shared/components/UI/LessonsByDayChart/LessonsByDayChart';
import { formatHours } from '@/shared/utils/formatHours';

import styles from './StudentLessonsTab.module.scss';

type Props = {
  stats?: StudentStatsReq;
};

export const StudentLessonsTab: FC<Props> = ({ stats }) => {
  const lessonsColumns = [
    {
      title: 'Date',
      key: 'date',
      render: (_: unknown, l: Lesson) => new Date(l.start).toLocaleDateString(),
      sorter: (a: Lesson, b: Lesson) =>
        new Date(a.start).getTime() - new Date(b.start).getTime(),
      defaultSortOrder: 'ascend' as SortOrder,
    },
    {
      title: 'Time',
      key: 'time',
      render: (_: unknown, l: Lesson) =>
        new Date(l.start).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, l: Lesson) =>
        new Date(l.end).getTime() <= Date.now() ? 'Done' : 'Planned',
    },
    {
      title: 'Duration',
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
      title: 'Price',
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
