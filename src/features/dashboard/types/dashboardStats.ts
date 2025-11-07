interface StudentStat {
  id: string;
  name: string;
  totalHours: number;
  totalRevenue: number;
  avatar: string;
}

interface GroupStat {
  id: string;
  title: string;
  totalHours: number;
  totalRevenue: number;
}

export interface DashboardStats {
  activeStudents: number;
  newStudents: number;
  activeGroups: number;
  newGroups: number;
  topGroupsByHours: GroupStat[];
  topGroupsByRevenue: GroupStat[];
  doneLessons: number;
  plannedLessons: number;
  currentMonthRevenue: number;
  expectedMonthRevenue: number;
  avgLessonPrice: number;
  averageHourPrice: number;
  averagePerHourStudentPrice: number;
  topStudentsByRevenue: StudentStat[];
  topStudentsByHours: StudentStat[];
  revenueMixExpected: {
    individualPct: number;
    groupPct: number;
  };
  revenueMixCurrent: {
    individualPct: number;
    groupPct: number;
  };
}

export type DashboardStatsRes = {
  start?: string;
  end?: string;
};
