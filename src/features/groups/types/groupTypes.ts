import type { Lesson } from '@/features/lessons/types/lessonTypes';

export interface Group {
  id: string;
  title: string;
  studentIds: string[];
  notes: string | null;
  price: number;
  createdAt: number;
  updatedAt: number;
}

export type GroupData = Omit<Group, 'id'>;

export type UpdateGroup = {
  id: string;
  data: Partial<GroupData>;
};

export type GroupStatsReq = {
  doneLessons: number;
  plannedLessons: number;
  totalHours: number;
  totalRevenue: number;
  avgHourPrice: number;
  lessons: Lesson[];
  lessonsByDayOfWeek: { day: number; count: number }[];
};

export type GroupStatsRes = {
  id: string;
  start?: string;
  end?: string;
};
