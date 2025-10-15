import cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Group } from './types/groupTypes';
import { Lesson } from './types/lessonTypes';
import { Student } from './types/studentTypes';

admin.initializeApp();
const db = admin.firestore();

interface StudentLite {
  id: string;
  name?: string;
}

const corsHandler = cors({
  origin: ['http://localhost:5173'],
  credentials: true,
});

export const getDashboardStats = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      // --- Определяем uid из Firebase ID Token ---
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      const userPath = `users/${uid}`;

      // --- Students ---
      const studentsSnap = await db.collection(`${userPath}/students`).get();
      const students: Student[] = studentsSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Student, 'id'>),
      }));
      const activeStudents = students.filter((s) => s.isActive).length;

      const monthStart = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      );
      const monthEnd = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0,
      );

      const newStudentsSnap = await db
        .collection(`${userPath}/students`)
        .where('createdAt', '>=', monthStart.getTime())
        .where('createdAt', '<=', monthEnd.getTime())
        .get();
      const newStudents = newStudentsSnap.size;

      // --- Groups ---
      const groupsSnap = await db.collection(`${userPath}/groups`).get();
      const groups: Group[] = groupsSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Group, 'id'>),
      }));
      const activeGroups = groups.filter(
        (g) => (g.studentIds || []).length > 0,
      ).length;

      // --- Lessons ---
      const lessonsSnap = await db.collection(`${userPath}/lessons`).get();
      const lessons: Lesson[] = lessonsSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Lesson, 'id'>),
      }));

      const now = Date.now();
      const doneLessons = lessons.filter(
        (l) => l.end <= now && l.end >= monthStart.getTime(),
      ).length;
      const plannedLessons = lessons.filter(
        (l) => l.start >= now && l.start <= monthEnd.getTime(),
      ).length;

      const totalRevenue = lessons.reduce((sum, l) => sum + (l.price || 0), 0);
      const avgLessonPrice =
        lessons.length > 0 ? totalRevenue / lessons.length : 0;

      // --- Top students ---
      const lessonsMap: Record<string, number> = {};
      const revenueMap: Record<string, number> = {};
      lessons.forEach((l) =>
        (l.students || []).forEach((s: StudentLite) => {
          lessonsMap[s.id] = (lessonsMap[s.id] || 0) + 1;
          revenueMap[s.id] = (revenueMap[s.id] || 0) + (l.price || 0);
        }),
      );
      const topByLessonsId = Object.entries(lessonsMap).sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0];
      const topByRevenueId = Object.entries(revenueMap).sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0];
      const topByLessons =
        students.find((s) => s.id === topByLessonsId)?.name || '—';
      const topByRevenue =
        students.find((s) => s.id === topByRevenueId)?.name || '—';

      const dashboardStats = {
        activeStudents,
        newStudents,
        activeGroups,
        doneLessons,
        plannedLessons,
        avgLessonPrice,
        totalRevenue,
        topByLessons,
        topByRevenue,
      };

      res.json(dashboardStats);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
});
