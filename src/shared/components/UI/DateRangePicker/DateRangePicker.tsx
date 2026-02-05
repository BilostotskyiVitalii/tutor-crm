import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Card, DatePicker, Space } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import styles from './DateRangePicker.module.scss';

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  range?: {
    start: string;
    end: string;
  };
  onApply: (params: { start: string; end: string }) => void;
}

export const DateRangePicker = ({ range, onApply }: DateRangePickerProps) => {
  const initialStart = range?.start
    ? dayjs(range.start)
    : dayjs().startOf('month');
  const initialEnd = range?.end ? dayjs(range.end) : dayjs().endOf('month');

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    initialStart,
    initialEnd,
  ]);

  const { t } = useTranslation();

  useEffect(() => {
    if (range?.start && range?.end) {
      setDateRange([dayjs(range.start), dayjs(range.end)]);
    }
  }, [range]);

  const handleDateChange: RangePickerProps['onChange'] = (dates) => {
    setDateRange(dates ?? [initialStart, initialEnd]);
  };

  const applyDateFilter = () => {
    if (dateRange[0] && dateRange[1]) {
      onApply({
        start: dateRange[0].startOf('day').toISOString(),
        end: dateRange[1].endOf('day').toISOString(),
      });
    }
  };

  return (
    <Card title={t('dateRangePicker.period')} className={styles.card}>
      <Space>
        <RangePicker
          value={dateRange}
          onChange={handleDateChange}
          allowClear
          format="DD.MM.YYYY"
        />
        <Button type="primary" onClick={applyDateFilter}>
          {t('dateRangePicker.apply')}
        </Button>
      </Space>
    </Card>
  );
};
