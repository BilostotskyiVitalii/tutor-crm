import { useState } from 'react';

import { Button, Card, DatePicker, Space } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  range: {
    start: string;
    end: string;
  };
  onApply: (params: { start: string; end: string }) => void;
}

export const DateRangePicker = ({ range, onApply }: DateRangePickerProps) => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs(range.start),
    dayjs(range.end),
  ]);

  const handleDateChange: RangePickerProps['onChange'] = (dates) => {
    setDateRange(dates ?? [dayjs(range.start), dayjs(range.end)]);
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
    <Card title="Select Period">
      <Space>
        <RangePicker
          value={dateRange}
          onChange={handleDateChange}
          allowClear
          format="DD.MM.YYYY"
        />
        <Button type="primary" onClick={applyDateFilter}>
          Apply
        </Button>
      </Space>
    </Card>
  );
};
