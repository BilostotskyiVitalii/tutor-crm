import { Request, Response } from 'express';

import { db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/auth';
import { Lesson } from '../../types/lessonTypes';

export const getStudentStats = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    const { start, end } = req.query;

    const startDate = start ? new Date(start as string) : new Date(0);
    const endDate = end ? new Date(end as string) : new Date();

    const userPath = `users/${uid}`;
    const lessonsSnap = await db.collection(`${userPath}/lessons`).get();

    const lessons = lessonsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Lesson[];

    const studentLessons = lessons
      .filter((l) => l.students.some((s) => s.id === id))
      .filter((l) => {
        const lessonStart = l.start.toDate().getTime();
        return lessonStart >= startDate.getTime() && lessonStart <= endDate.getTime();
      });

    const now = Date.now();
    const doneLessons = studentLessons.filter((l) => l.end.toDate().getTime() <= now);
    const plannedLessons = studentLessons.filter((l) => l.end.toDate().getTime() > now);

    const totalHours = doneLessons.reduce((sum, l) => {
      const startTs = l.start.toDate().getTime();
      const endTs = l.end.toDate().getTime();
      return sum + (endTs - startTs) / 3_600_000;
    }, 0);

    const totalRevenue = doneLessons.reduce((sum, l) => sum + (l.price || 0), 0);

    const lessonsWithStatus = studentLessons.map((l) => ({
      id: l.id,
      start: l.start.toDate().toISOString(),
      end: l.end.toDate().toISOString(),
      price: l.price,
      durationHours: (l.end.toDate().getTime() - l.start.toDate().getTime()) / 3_600_000,
      status: l.end.toDate().getTime() <= now ? 'Done' : 'Planned',
    }));

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
      lessons: lessonsWithStatus,
      lessonsByDayOfWeek,
    });
  } catch {
    return res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
