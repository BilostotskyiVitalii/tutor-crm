import { Router } from 'express';
import { Timestamp } from 'firebase-admin/firestore';

import { admin } from '../firebase';
import { requireAuth } from '../middleware/requireAuth';
import { fetchGroups } from '../repos/groupsRepo';
import { fetchLessonsForRange } from '../repos/lessonsRepo';
import { fetchStudents } from '../repos/studentsRepo';
import {
  computeDonePlanned,
  computeGroupTops,
  computeRevenue,
  computeRevenueMix,
  computeStudentTops,
} from '../services/stats.service';
import { AuthenticatedRequest } from '../types/auth';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', requireAuth, async (req, res) => {
  const { uid } = (req as AuthenticatedRequest).user;

  const { start, end } = req.query;

  const startTs = Timestamp.fromDate(new Date(start as string));
  const endExclusiveTs = Timestamp.fromDate(new Date(end as string));
  const now = admin.firestore.Timestamp.now();

  const [students, groups, lessons] = await Promise.all([
    fetchStudents(uid),
    fetchGroups(uid),
    fetchLessonsForRange(uid, startTs, endExclusiveTs),
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

  const lessonsByDayOfWeek = [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    day,
    count: 0,
  }));

  for (const lesson of lessons) {
    const day = lesson.start.toDate().getDay();
    lessonsByDayOfWeek[day].count += 1;
  }

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
    lessonsByDayOfWeek,
  });
});
