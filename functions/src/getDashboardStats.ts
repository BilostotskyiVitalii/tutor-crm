import cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Lesson } from './types/lessonTypes';
import { Student, StudentData } from './types/studentTypes';

admin.initializeApp();
const db = admin.firestore();

const corsHandler = cors({
  origin: ['http://localhost:5173'],
  credentials: true,
});

type TopStudentStats = {
  id: string;
  name: string;
  avatar?: string;
  totalHours: number;
  totalRevenue: number;
};

const statsMap: Record<string, TopStudentStats> = {};

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

      // ------- Dates -------

      const nowTs = admin.firestore.Timestamp.now();
      const monthStartTs = admin.firestore.Timestamp.fromDate(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      );
      const monthEndTs = admin.firestore.Timestamp.fromDate(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      );

      // --- Students ---

      const studentsSnap = await db
        .collection(`${userPath}/students`)
        .where('isActive', '==', true)
        .get();
      const students: Student[] = studentsSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as StudentData),
      }));

      const activeStudents = studentsSnap.size;

      const newStudentsSnap = await db
        .collection(`${userPath}/students`)
        .where('createdAt', '>=', monthStartTs)
        .get();

      const newStudents = newStudentsSnap.size;

      // --- Groups ---

      const groupsSnap = await db.collection(`${userPath}/groups`).get();
      const activeGroups = groupsSnap.size;

      // --- Lessons ---

      const monthLessonsSnap = await db
        .collection(`${userPath}/lessons`)
        .where('start', '>=', monthStartTs)
        .get();
      const lessons = monthLessonsSnap.docs.map((doc) => doc.data() as Lesson);

      const doneLessonsData = lessons.filter((l) => l.end <= nowTs);
      const plannedLessonsData = lessons.filter(
        (l) => l.end >= nowTs && l.end <= monthEndTs,
      );

      const doneLessons = doneLessonsData.length;
      const plannedLessons = plannedLessonsData.length;
      const doneHours = doneLessonsData.reduce((sum, l) => {
        const durationMs = l.end.toMillis() - l.start.toMillis();
        const durationHours = durationMs / (1000 * 60 * 60);
        return sum + durationHours;
      }, 0);

      // ---- Income ----

      const currentMonthIncome = doneLessonsData.reduce(
        (sum, l) => sum + (l.price || 0),
        0,
      );
      const plannedLessonsIncome = plannedLessonsData.reduce(
        (sum, l) => sum + (l.price || 0),
        0,
      );
      const expectedMonthIncome = currentMonthIncome + plannedLessonsIncome;

      const averageHourPrice =
        doneHours > 0 ? currentMonthIncome / doneHours : 0;
      const avgLessonPrice =
        doneLessons > 0 ? currentMonthIncome / doneLessons : 0;
      const totalStudentPrice = students.reduce(
        (sum, s) => sum + (s.price || 0),
        0,
      );
      const averagePerHourStudentPrice =
        activeStudents > 0 ? totalStudentPrice / activeStudents : 0;

      // --- Top students ---

      students.forEach((s) => {
        statsMap[s.id] = {
          id: s.id,
          name: s.name,
          totalHours: 0,
          totalRevenue: 0,
          avatar: s.avatarUrl,
        };
      });

      lessons.forEach((lesson) => {
        if (!lesson.start || !lesson.end || !lesson.students?.length) {
          return;
        }

        const lessonHours =
          (lesson.end.toMillis() - lesson.start.toMillis()) / (1000 * 60 * 60);
        if (lessonHours <= 0) {
          return;
        }

        const lessonRevenuePerStudent =
          (lesson.price || 0) / lesson.students.length;

        lesson.students.forEach((studentInLesson) => {
          const stat = statsMap[studentInLesson.id];
          if (stat) {
            stat.totalHours += lessonHours;
            stat.totalRevenue += lessonRevenuePerStudent;
          }
        });
      });

      const statsArray = Object.values(statsMap);

      const topStudentsByHours = [...statsArray]
        .sort((a, b) => b.totalHours - a.totalHours)
        .slice(0, 3);
      const topStudentsByIncome = [...statsArray]
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 3);

      const dashboardStats = {
        activeStudents,
        newStudents,
        activeGroups,
        doneLessons,
        plannedLessons,
        currentMonthIncome,
        expectedMonthIncome,
        avgLessonPrice,
        averageHourPrice,
        averagePerHourStudentPrice,
        topStudentsByHours,
        topStudentsByIncome,
      };

      res.json(dashboardStats);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
});
