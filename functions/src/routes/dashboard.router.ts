import { Request, Response, Router } from 'express';

import { fetchGroups } from '../repos/groupsRepo';
import { fetchLessonsForMonth } from '../repos/lessonsRepo';
import { fetchStudents } from '../repos/studentsRepo';
import {
  computeDonePlanned,
  computeGroupTops,
  computeRevenue,
  computeRevenueMix,
  computeStudentTops,
} from '../services/stats.service';
import { extractUidFromBearer } from '../utils/auth';
import { monthRange, nowTs } from '../utils/dates';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', async (req: Request, res: Response) => {
  try {
    const uid = await extractUidFromBearer(req);
    const userPath = `users/${uid}`;

    const { startTs, endExclusiveTs } = monthRange();
    const now = nowTs();

    const [students, groups, lessons] = await Promise.all([
      fetchStudents(userPath),
      fetchGroups(userPath),
      fetchLessonsForMonth(userPath, startTs, endExclusiveTs),
    ]);

    const activeStudents = students.filter((s) => s.isActive).length;
    const newStudents = students.filter(
      (s) => s.createdAt && s.createdAt >= startTs,
    ).length;
    const activeGroups = groups.length;
    const newGroups = groups.filter(
      (g) => g.createdAt && g.createdAt >= startTs,
    ).length;

    const { done, planned, doneHours } = computeDonePlanned(
      lessons,
      now,
      endExclusiveTs,
    );
    const { current, expected } = computeRevenue(done, planned);

    const avgHourPrice = doneHours > 0 ? current / doneHours : 0;
    const avgLessonPrice = done.length > 0 ? current / done.length : 0;
    const avgPerHourStudentPrice =
      activeStudents > 0
        ? students.reduce((s, x) => s + (x.price || 0), 0) / activeStudents
        : 0;

    const studentTops = computeStudentTops(students, lessons);
    const groupTops = computeGroupTops(groups, lessons);
    const mixes = computeRevenueMix(done, [...done, ...planned]);

    return res.json({
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
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return res.status(401).json({ message });
  }
});
