import { Request, Response } from 'express';
import { Timestamp } from 'firebase-admin/firestore';

import { admin } from '../firebase';
import { LessonRepo } from '../repos/lesson.repo';
import { AuthenticatedRequest } from '../types/authTypes';

type EntityType = 'group' | 'student';

export const getStats = (type: EntityType) => async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    const { start, end } = req.query;

    const startTs = Timestamp.fromDate(new Date(start as string));
    const endExclusiveTs = Timestamp.fromDate(new Date(end as string));
    const now = admin.firestore.Timestamp.now();

    const lessons = await LessonRepo.getByRange(uid, startTs, endExclusiveTs);

    const filteredLessons = lessons.filter((l) => {
      if (type === 'group') {
        return l.groupId === id;
      }
      if (type === 'student') {
        return l.students?.some((s: { id: string }) => s.id === id);
      }
      return false;
    });

    const lessonsInRange = filteredLessons.filter(
      (l) => l.start >= startTs && l.start <= endExclusiveTs,
    );

    const doneLessons = lessonsInRange.filter((l) => l.end <= now);
    const plannedLessons = lessonsInRange.filter((l) => l.end > now);

    const totalHours = doneLessons.reduce(
      (sum, l) => sum + (l.end.toMillis() - l.start.toMillis()) / 3_600_000,
      0,
    );

    const totalRevenue = doneLessons.reduce((sum, l) => sum + (l.price || 0), 0);

    const lessonsByDayOfWeek = Array.from({ length: 7 }, (_, day) => ({
      day,
      count: 0,
    }));

    for (const lesson of lessonsInRange) {
      const day = lesson.start.toDate().getDay();
      lessonsByDayOfWeek[day].count += 1;
    }

    return res.json({
      doneLessons: doneLessons.length,
      plannedLessons: plannedLessons.length,
      totalHours,
      totalRevenue,
      lessons: lessonsInRange,
      lessonsByDayOfWeek,
    });
  } catch {
    return res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
