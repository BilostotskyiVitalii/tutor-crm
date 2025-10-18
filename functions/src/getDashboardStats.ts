import cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Group, GroupData } from './types/groupTypes';
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

const studentStatsMap: Record<string, TopStudentStats> = {};

type TopGroupsStats = {
  id: string;
  title: string;
  totalHours: number;
  totalRevenue: number;
};

const groupStatsMap: Record<string, TopGroupsStats> = {};

const toPercent = (part: number, total: number): number =>
  total > 0 ? Math.round((part / total) * 100) : 0;

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
      const groups: Group[] = groupsSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as GroupData),
      }));
      const activeGroups = groupsSnap.size;
      const newGroupsSnap = await db
        .collection(`${userPath}/groups`)
        .where('createdAt', '>=', monthStartTs)
        .get();

      const newGroups = newGroupsSnap.size;

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

      // ---- Revenue ----

      const currentMonthRevenue = doneLessonsData.reduce(
        (sum, l) => sum + (l.price || 0),
        0,
      );
      const plannedLessonsRevenue = plannedLessonsData.reduce(
        (sum, l) => sum + (l.price || 0),
        0,
      );
      const expectedMonthRevenue = currentMonthRevenue + plannedLessonsRevenue;

      const averageHourPrice =
        doneHours > 0 ? currentMonthRevenue / doneHours : 0;
      const avgLessonPrice =
        doneLessons > 0 ? currentMonthRevenue / doneLessons : 0;
      const totalStudentPrice = students.reduce(
        (sum, s) => sum + (s.price || 0),
        0,
      );
      const averagePerHourStudentPrice =
        activeStudents > 0 ? totalStudentPrice / activeStudents : 0;

      // --- Top students ---

      Object.keys(studentStatsMap).forEach((k) => delete studentStatsMap[k]);

      students.forEach((s) => {
        studentStatsMap[s.id] = {
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
          const stat = studentStatsMap[studentInLesson.id];
          if (stat) {
            stat.totalHours += lessonHours;
            stat.totalRevenue += lessonRevenuePerStudent;
          }
        });
      });

      const statsArray = Object.values(studentStatsMap);

      const topStudentsByHours = [...statsArray]
        .sort((a, b) => b.totalHours - a.totalHours)
        .slice(0, 3);
      const topStudentsByRevenue = [...statsArray]
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 3);

      // --- Top groups ---

      Object.keys(groupStatsMap).forEach((k) => delete groupStatsMap[k]);

      groups.forEach((g) => {
        groupStatsMap[g.id] = {
          id: g.id,
          title: g.title,
          totalHours: 0,
          totalRevenue: 0,
        };
      });

      lessons.forEach((lesson) => {
        // рахуємо лише уроки, прив'язані до груп
        if (!lesson.groupId || !lesson.start || !lesson.end) {
          return;
        }

        const groupLessonHours =
          (lesson.end.toMillis() - lesson.start.toMillis()) / (1000 * 60 * 60);

        if (groupLessonHours <= 0) {
          return;
        }

        const stat = groupStatsMap[lesson.groupId];
        if (!stat) {
          return;
        } // група могла бути видалена або неактивна

        stat.totalHours += groupLessonHours;
        stat.totalRevenue += lesson.price || 0; // весь дохід уроку відносимо на групу
      });

      const statsGroupArray = Object.values(groupStatsMap);

      // назви зробив у множині для симетрії зі студентами
      const topGroupsByHours = [...statsGroupArray]
        .sort((a, b) => b.totalHours - a.totalHours)
        .slice(0, 3);

      const topGroupsByRevenue = [...statsGroupArray]
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 3);

      // ---- PRCnts-----

      // --- Revenue mix (CURRENT = тільки проведені уроки цього місяця) ---
      const revenueIndividualCurrent = doneLessonsData
        .filter((l) => !l.groupId) // індивідуальні уроки
        .reduce((sum, l) => sum + (l.price || 0), 0);

      const revenueGroupCurrent = doneLessonsData
        .filter((l) => !!l.groupId) // групові уроки
        .reduce((sum, l) => sum + (l.price || 0), 0);

      const totalRevenueCurrent =
        revenueIndividualCurrent + revenueGroupCurrent;

      const revenueMixCurrent = {
        individualPct: toPercent(revenueIndividualCurrent, totalRevenueCurrent), // 0..100
        groupPct: toPercent(revenueGroupCurrent, totalRevenueCurrent), // 0..100
      };

      // --- Revenue mix (EXPECTED = проведені + заплановані до кінця місяця) ---
      const allThisMonth = [...doneLessonsData, ...plannedLessonsData];

      const revenueIndividualExpected = allThisMonth
        .filter((l) => !l.groupId)
        .reduce((sum, l) => sum + (l.price || 0), 0);

      const revenueGroupExpected = allThisMonth
        .filter((l) => !!l.groupId)
        .reduce((sum, l) => sum + (l.price || 0), 0);

      const totalRevenueExpected =
        revenueIndividualExpected + revenueGroupExpected;

      const revenueMixExpected = {
        individualPct: toPercent(
          revenueIndividualExpected,
          totalRevenueExpected,
        ), // 0..100
        groupPct: toPercent(revenueGroupExpected, totalRevenueExpected), // 0..100
      };

      const dashboardStats = {
        activeStudents,
        newStudents,
        activeGroups,
        newGroups,
        doneLessons,
        plannedLessons,
        currentMonthRevenue,
        expectedMonthRevenue,
        avgLessonPrice,
        averageHourPrice,
        averagePerHourStudentPrice,
        topStudentsByHours,
        topStudentsByRevenue,
        topGroupsByHours,
        topGroupsByRevenue,
        revenueMixCurrent,
        revenueMixExpected,
      };

      res.json(dashboardStats);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
});
