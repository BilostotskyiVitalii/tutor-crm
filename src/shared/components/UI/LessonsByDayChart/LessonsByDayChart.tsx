import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Typography } from 'antd';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import styles from './LessonsByDayChart.module.scss';

const { Text } = Typography;

interface DayData {
  day: number;
  count: number;
}

interface Props {
  data?: DayData[];
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const LessonsByDayChart: FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  const lessonsByDayData =
    data?.map((i) => ({
      day: typeof i.day === 'number' ? daysOfWeek[i.day] : i.day,
      lessons: i.count,
    })) ?? [];

  return (
    <Card title={t('lessonsByDay')} className={styles.chartWrapper}>
      {data?.length ? (
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
        <Text type="secondary">{t('noLessonsData')}</Text>
      )}
    </Card>
  );
};
