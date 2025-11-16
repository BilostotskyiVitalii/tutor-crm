import { admin } from '../firebase';
import { GroupRepo } from '../repos/group.repo';
import { LessonRepo } from '../repos/lesson.repo';
import { StudentRepo } from '../repos/student.repo';
import { Group } from '../types/groupTypes';
import { Lesson } from '../types/lessonTypes';
import { Student } from '../types/studentTypes';
import { toPercent } from '../utils/toPercent';

function computeDonePlanned(
  lessons: Lesson[],
  now: admin.firestore.Timestamp,
  endExclusive: admin.firestore.Timestamp,
) {
  const done = lessons.filter((l) => l.end && l.end <= now);
  const planned = lessons.filter((l) => l.end && l.end > now && l.end < endExclusive);
  const doneHours = done.reduce((s, l) => s + (l.end.toMillis() - l.start.toMillis()) / 36e5, 0);
  return { done, planned, doneHours };
}

function computeRevenue(done: Lesson[], planned: Lesson[]) {
  const current = done.reduce((s, l) => s + (l.price || 0), 0);
  const plannedSum = planned.reduce((s, l) => s + (l.price || 0), 0);
  return { current, expected: current + plannedSum, planned: plannedSum };
}

function computeStudentTops(students: Student[], lessons: Lesson[]) {
  const stats = new Map<
    string,
    { id: string; name: string; avatar?: string; totalHours: number; totalRevenue: number }
  >();
  students.forEach((s) =>
    stats.set(s.id, {
      id: s.id,
      name: s.name,
      avatar: s.avatarUrl ?? undefined,
      totalHours: 0,
      totalRevenue: 0,
    }),
  );
  lessons.forEach((l) => {
    if (!l.start || !l.end || !l.students?.length) {
      return;
    }
    const hours = (l.end.toMillis() - l.start.toMillis()) / 36e5;
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

function computeGroupTops(groups: Group[], lessons: Lesson[]) {
  const stats = new Map<
    string,
    { id: string; title: string; totalHours: number; totalRevenue: number }
  >();
  groups.forEach((g) =>
    stats.set(g.id, { id: g.id, title: g.title, totalHours: 0, totalRevenue: 0 }),
  );
  lessons.forEach((l) => {
    if (!l.groupId || !l.start || !l.end) {
      return;
    }
    const hours = (l.end.toMillis() - l.start.toMillis()) / 36e5;
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

function computeRevenueMix(done: Lesson[], allMonth: Lesson[]) {
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

export const DashboardService = {
  async getDashboard(
    uid: string,
    startTs: admin.firestore.Timestamp,
    endExclusiveTs: admin.firestore.Timestamp,
  ) {
    const now = admin.firestore.Timestamp.now();

    // Завантажуємо всі сутності через репозиторії
    const [students, groups, lessons] = await Promise.all([
      StudentRepo.getAll(uid),
      GroupRepo.getAll(uid),
      LessonRepo.getByRange(uid, startTs, endExclusiveTs),
    ]);

    const activeStudents = students.filter((s) => s.isActive).length;
    const newStudents = students.filter((s) => s.createdAt && s.createdAt >= startTs).length;
    const activeGroups = groups.length;
    const newGroups = groups.filter((g) => g.createdAt && g.createdAt >= startTs).length;

    const { done, planned, doneHours } = computeDonePlanned(lessons, now, endExclusiveTs);
    const { current, expected } = computeRevenue(done, planned);

    const avgHourPrice = doneHours > 0 ? current / doneHours : 0;
    const avgLessonPrice = done.length > 0 ? current / done.length : 0;
    const avgPerHourStudentPrice =
      activeStudents > 0 ? students.reduce((s, x) => s + (x.price || 0), 0) / activeStudents : 0;

    const studentTops = computeStudentTops(students, lessons);
    const groupTops = computeGroupTops(groups, lessons);
    const mixes = computeRevenueMix(done, [...done, ...planned]);

    const lessonsByDayOfWeek = Array.from({ length: 7 }, (_, day) => ({ day, count: 0 }));
    for (const lesson of lessons) {
      if (lesson.start) {
        const day = lesson.start.toDate().getDay();
        lessonsByDayOfWeek[day].count += 1;
      }
    }

    return {
      activeStudents,
      newStudents,
      activeGroups,
      newGroups,
      doneLessons: done.length,
      plannedLessons: planned.length,
      currentMonthRevenue: current,
      expectedMonthRevenue: expected,
      avgLessonPrice,
      averageHourPrice: avgHourPrice,
      averagePerHourStudentPrice: avgPerHourStudentPrice,
      topStudentsByHours: studentTops.byHours,
      topStudentsByRevenue: studentTops.byRevenue,
      topGroupsByHours: groupTops.byHours,
      topGroupsByRevenue: groupTops.byRevenue,
      revenueMixCurrent: mixes.current,
      revenueMixExpected: mixes.expected,
      lessonsByDayOfWeek,
    };
  },
};
