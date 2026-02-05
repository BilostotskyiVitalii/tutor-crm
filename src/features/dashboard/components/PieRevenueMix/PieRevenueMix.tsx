import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const modeOptions = [
    { label: `${t('current')}`, value: 'current' },
    { label: `${t('expected')}`, value: 'expected' },
  ];

  const mix = mode === 'current' ? data?.current : data?.expected;

  const chartData = [
    { name: `${t('indiv')}`, value: mix?.individualPct },
    { name: `${t('group')}`, value: mix?.groupPct },
  ];

  return (
    <Card
      title={
        <Flex justify="space-between">
          <span>{`🍰 ${t('revenueMix')}`}</span>
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
