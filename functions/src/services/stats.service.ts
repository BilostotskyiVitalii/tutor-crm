import { admin } from '../firebase';
import { Group } from '../types/groupTypes';
import { Lesson } from '../types/lessonTypes';
import { Student } from '../types/studentTypes';
import { toPercent } from '../utils/math';

export function computeDonePlanned(
  lessons: Lesson[],
  now: admin.firestore.Timestamp,
  endExclusive: admin.firestore.Timestamp,
) {
  const done = lessons.filter((l) => l.end && l.end <= now);
  const planned = lessons.filter((l) => l.end && l.end > now && l.end < endExclusive);
  const doneHours = done.reduce((s, l) => s + (l.end.toMillis() - l.start.toMillis()) / 36e5, 0);
  return { done, planned, doneHours };
}

export function computeRevenue(done: Lesson[], planned: Lesson[]) {
  const current = done.reduce((s, l) => s + (l.price || 0), 0);
  const plannedSum = planned.reduce((s, l) => s + (l.price || 0), 0);
  return { current, expected: current + plannedSum, planned: plannedSum };
}

export function computeStudentTops(students: Student[], lessons: Lesson[]) {
  const stats = new Map<
    string,
    {
      id: string;
      name: string;
      avatar?: string;
      totalHours: number;
      totalRevenue: number;
    }
  >();
  students.forEach((s) =>
    stats.set(s.id, {
      id: s.id,
      name: s.name,
      avatar: s.avatarUrl,
      totalHours: 0,
      totalRevenue: 0,
    }),
  );
  lessons.forEach((l) => {
    if (!l.start || !l.end || !l.students?.length) {
      return;
    }
    const hours = (l.end.toMillis() - l.start.toMillis()) / 36e5;
    if (hours <= 0) {
      return;
    }
    const perStudent = (l.price || 0) / l.students.length;
    l.students.forEach((st) => {
      const stStat = stats.get(st.id);
      if (stStat) {
        stStat.totalHours += hours;
        stStat.totalRevenue += perStudent;
      }
    });
  });
  const arr = [...stats.values()];
  return {
    byHours: arr
      .slice()
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 3),
    byRevenue: arr
      .slice()
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 3),
  };
}

export function computeGroupTops(groups: Group[], lessons: Lesson[]) {
  const stats = new Map<
    string,
    { id: string; title: string; totalHours: number; totalRevenue: number }
  >();
  groups.forEach((g) =>
    stats.set(g.id, {
      id: g.id,
      title: g.title,
      totalHours: 0,
      totalRevenue: 0,
    }),
  );
  lessons.forEach((l) => {
    if (!l.groupId || !l.start || !l.end) {
      return;
    }
    const hours = (l.end.toMillis() - l.start.toMillis()) / 36e5;
    if (hours <= 0) {
      return;
    }
    const st = stats.get(l.groupId);
    if (st) {
      st.totalHours += hours;
      st.totalRevenue += l.price || 0;
    }
  });
  const arr = [...stats.values()];
  return {
    byHours: arr
      .slice()
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 3),
    byRevenue: arr
      .slice()
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 3),
  };
}

export function computeRevenueMix(done: Lesson[], allMonth: Lesson[]) {
  const sum = (xs: Lesson[]) => xs.reduce((s, l) => s + (l.price || 0), 0);
  const currentInd = sum(done.filter((l) => !l.groupId));
  const currentGrp = sum(done.filter((l) => !!l.groupId));
  const expectedInd = sum(allMonth.filter((l) => !l.groupId));
  const expectedGrp = sum(allMonth.filter((l) => !!l.groupId));
  const currentTotal = currentInd + currentGrp;
  const expectedTotal = expectedInd + expectedGrp;
  return {
    current: {
      individualPct: toPercent(currentInd, currentTotal),
      groupPct: toPercent(currentGrp, currentTotal),
    },
    expected: {
      individualPct: toPercent(expectedInd, expectedTotal),
      groupPct: toPercent(expectedGrp, expectedTotal),
    },
  };
}
