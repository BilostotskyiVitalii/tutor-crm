import type { FC } from 'react';

import { Card, Table, Typography } from 'antd';
import type { SortOrder } from 'antd/es/table/interface';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type {
  LessonWithStatus,
  StudentStats,
} from '@/features/students/types/studentTypes';
import { formatHours } from '@/shared/utils/formatHours';

import styles from './StudentLessonsTab.module.scss';

const { Text } = Typography;
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Props = {
  stats?: StudentStats;
};

export const StudentLessonsTab: FC<Props> = ({ stats }) => {
  const lessonsByDayData =
    stats?.lessonsByDayOfWeek?.map((i) => ({
      day: daysOfWeek[i.day],
      lessons: i.count,
    })) ?? [];

  const lessonsColumns = [
    {
      title: 'Date',
      key: 'date',
      render: (_: unknown, l: LessonWithStatus) =>
        new Date(l.start).toLocaleDateString(),
      sorter: (a: LessonWithStatus, b: LessonWithStatus) =>
        new Date(a.start).getTime() - new Date(b.start).getTime(),
      defaultSortOrder: 'ascend' as SortOrder,
    },
    {
      title: 'Time',
      key: 'time',
      render: (_: unknown, l: LessonWithStatus) =>
        new Date(l.start).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, l: LessonWithStatus) => l.status,
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_: unknown, l: LessonWithStatus) =>
        l.durationHours ? formatHours(l.durationHours) : '-',
      sorter: (a: LessonWithStatus, b: LessonWithStatus) =>
        (a.durationHours ?? 0) - (b.durationHours ?? 0),
    },
    {
      title: 'Price',
      key: 'price',
      render: (_: unknown, l: LessonWithStatus) =>
        l.price ? `₴ ${l.price}` : '-',
      sorter: (a: LessonWithStatus, b: LessonWithStatus) =>
        (a.price ?? 0) - (b.price ?? 0),
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

      <Card title="Lessons by Day of Week" className={styles.chartWrapper}>
        {lessonsByDayData.length ? (
          <ResponsiveContainer height={250}>
            <BarChart data={lessonsByDayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="lessons"
                fill="var(--chart-cols-color)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Text type="secondary">No lesson data available</Text>
        )}
      </Card>
    </div>
  );
};
