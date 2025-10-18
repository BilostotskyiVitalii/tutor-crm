import type { FC } from 'react';
import { useState } from 'react';

import { Card, Flex, Segmented } from 'antd';
import type { PieLabelRenderProps } from 'recharts';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { useGetDashboardStatsQuery } from '@/features/dashboard/api/dashboardApi';

const DEFAULT_COLORS: [string, string] = ['#1677ff', '#36cfc9']; // Individual / Group

const PieRevenueMix: FC = () => {
  const [mode, setMode] = useState<'current' | 'expected'>('current');
  const { data: dashData, isLoading } = useGetDashboardStatsQuery();

  // Обираємо набір даних залежно від перемикача
  const mix =
    mode === 'current'
      ? dashData?.revenueMixCurrent
      : dashData?.revenueMixExpected;

  const chartData = [
    {
      name: 'Individual',
      value: mix?.individualPct,
    },
    { name: 'Group', value: mix?.groupPct },
  ];

  const header = (
    <Flex justify="space-between">
      <span>🍰 Revenue mix</span>
      <Segmented
        size="small"
        value={mode}
        onChange={(v) => setMode(v as 'current' | 'expected')}
        options={[
          { label: 'Current', value: 'current' },
          { label: 'Expected', value: 'expected' },
        ]}
      />
    </Flex>
  );

  return (
    <Card title={header} loading={isLoading}>
      <div style={{ height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              label={(props: PieLabelRenderProps) =>
                `${((props.percent as number) * 100).toFixed()}%`
              }
            >
              {chartData.map((item, idx) => (
                <Cell key={item.name} fill={DEFAULT_COLORS[idx]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PieRevenueMix;
