import { Router } from 'express';
import { Timestamp } from 'firebase-admin/firestore';

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
import { nowTs } from '../utils/dates';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', requireAuth, async (req, res) => {
  const { uid } = (req as import('../types/auth').AuthenticatedRequest).user;
  const userPath = `users/${uid}`;

  const { start, end } = req.query;

  const startDate = start ? new Date(start as string) : new Date(0);
  const endDate = end ? new Date(end as string) : new Date();

  const startTs = Timestamp.fromDate(startDate);
  const endExclusiveTs = Timestamp.fromDate(endDate);
  const now = nowTs();

  const [students, groups, lessons] = await Promise.all([
    fetchStudents(userPath),
    fetchGroups(userPath),
    fetchLessonsForRange(userPath, startTs, endExclusiveTs),
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
});
