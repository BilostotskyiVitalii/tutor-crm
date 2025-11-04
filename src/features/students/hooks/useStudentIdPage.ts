import { useState } from 'react';
import { useParams } from 'react-router-dom';

import dayjs, { Dayjs } from 'dayjs';

import {
  useGetStudentByIdQuery,
  useGetStudentStatsQuery,
} from '@/features/students/api/studentsApi';

export const useStudentPage = () => {
  const { id } = useParams<{ id: string }>();
  const defaultStart = dayjs().startOf('month');
  const defaultEnd = dayjs().endOf('month');

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    defaultStart,
    defaultEnd,
  ]);

  const [queryParams, setQueryParams] = useState({
    start: defaultStart.toISOString(),
    end: defaultEnd.toISOString(),
  });

  const { data: student, isLoading: studentLoading } = useGetStudentByIdQuery(
    id || '',
  );

  const { data: stats, isLoading: statsLoading } = useGetStudentStatsQuery({
    id: id || '',
    ...queryParams,
  });

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates ?? [defaultStart, defaultEnd]);
  };

  const applyDateFilter = () => {
    if (dateRange[0] && dateRange[1]) {
      setQueryParams({
        start: dateRange[0].startOf('day').toISOString(),
        end: dateRange[1].endOf('day').toISOString(),
      });
    }
  };

  return {
    student,
    stats,
    studentLoading,
    statsLoading,
    dateRange,
    handleDateChange,
    applyDateFilter,
  };
};
