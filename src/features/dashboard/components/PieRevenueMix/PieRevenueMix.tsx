import type { FC } from 'react';
import { useState } from 'react';

import { Card, Flex, Segmented } from 'antd';
import type { PieLabelRenderProps } from 'recharts';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { useGetDashboardStatsQuery } from '@/features/dashboard/api/dashboardApi';

import styles from './PieRevenueMix.module.scss';

type ModeType = 'current' | 'expected';

const PieRevenueMix: FC = () => {
  const [mode, setMode] = useState<ModeType>('current');
  const { data: dashData, isLoading } = useGetDashboardStatsQuery();

  const modeOptions = [
    { label: 'Current', value: 'current' },
    { label: 'Expected', value: 'expected' },
  ];

  const mix =
    mode === 'current'
      ? dashData?.revenueMixCurrent
      : dashData?.revenueMixExpected;

  const chartData = [
    { name: 'Individual', value: mix?.individualPct },
    { name: 'Group', value: mix?.groupPct },
  ];

  return (
    <Card
      loading={isLoading}
      title={
        <Flex justify="space-between">
          <span>🍰 Revenue mix</span>
          <Segmented
            size="small"
            value={mode}
            onChange={(v) => setMode(v as ModeType)}
            options={modeOptions}
          />
        </Flex>
      }
    >
      <div className={`${styles.chartWrapper}`}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              label={(props: PieLabelRenderProps) =>
                `${(props.percent as number) * 100}%`
              }
            >
              <Cell key="individual" fill="var(--chart-individual)" />
              <Cell key="group" fill="var(--chart-group)" />
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PieRevenueMix;
