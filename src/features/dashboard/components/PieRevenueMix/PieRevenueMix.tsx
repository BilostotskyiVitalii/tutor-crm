import type { FC } from 'react';
import { useState } from 'react';

import { Card, Flex, Segmented } from 'antd';
import type { PieLabelRenderProps } from 'recharts';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

import type { RevenueMix } from '@/features/dashboard/types/dashboardStats';

import styles from './PieRevenueMix.module.scss';

type ModeType = 'current' | 'expected';

interface PieRevenueMixProps {
  data?: {
    current?: RevenueMix;
    expected?: RevenueMix;
  };
}

const PieRevenueMix: FC<PieRevenueMixProps> = ({ data }) => {
  const [mode, setMode] = useState<ModeType>('current');

  const modeOptions = [
    { label: 'Current', value: 'current' },
    { label: 'Expected', value: 'expected' },
  ];

  const mix = mode === 'current' ? data?.current : data?.expected;

  const chartData = [
    { name: 'Individual', value: mix?.individualPct },
    { name: 'Group', value: mix?.groupPct },
  ];

  return (
    <Card
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
