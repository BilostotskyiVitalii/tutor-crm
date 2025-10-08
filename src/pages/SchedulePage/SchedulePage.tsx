import { type FC } from 'react';

import { Flex } from 'antd';

import CustomCalendar from '@/features/calendar/components/CustomCalendar/CustomCalendar';

const SchedulePage: FC = () => {
  return (
    <Flex vertical gap="large">
      <CustomCalendar />
    </Flex>
  );
};

export default SchedulePage;
