import { Request, Response } from 'express';
import { Timestamp } from 'firebase-admin/firestore';

import { admin } from '../../firebase';
import { fetchLessonsForRange } from '../../repos/lessonsRepo';
import { AuthenticatedRequest } from '../../types/auth';

export const getStudentStats = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    const { start, end } = req.query;

    const startTs = Timestamp.fromDate(new Date(start as string));
    const endExclusiveTs = Timestamp.fromDate(new Date(end as string));
    const now = admin.firestore.Timestamp.now();

    const lessons = await fetchLessonsForRange(uid, startTs, endExclusiveTs);

    const studentLessons = lessons
      .filter((l) => l.students.some((s) => s.id === id))
      .filter((l) => {
        return l.start >= startTs && l.start <= endExclusiveTs;
      });

    const doneLessons = studentLessons.filter((l) => l.end <= now);
    const plannedLessons = studentLessons.filter((l) => l.end > now);

    const totalHours = doneLessons.reduce((sum, l) => {
      return sum + (l.end.toMillis() - l.start.toMillis()) / 3_600_000;
    }, 0);

    const totalRevenue = doneLessons.reduce((sum, l) => sum + (l.price || 0), 0);

    const lessonsByDayOfWeek = [0, 1, 2, 3, 4, 5, 6].map((day) => ({
      day,
      count: 0,
    }));

    for (const lesson of studentLessons) {
      const day = lesson.start.toDate().getDay();
      lessonsByDayOfWeek[day].count += 1;
    }

    return res.json({
      doneLessons: doneLessons.length,
      plannedLessons: plannedLessons.length,
      totalHours,
      totalRevenue,
      lessons: studentLessons,
      lessonsByDayOfWeek,
    });
  } catch {
    return res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
