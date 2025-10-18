import { admin, db } from '../firebase';
import { Lesson, LessonData } from '../types/lessonTypes';

export const fetchLessonsForMonth = async (
  userPath: string,
  startTs: admin.firestore.Timestamp,
  endExclusiveTs: admin.firestore.Timestamp,
): Promise<Lesson[]> => {
  const snap = await db
    .collection(`${userPath}/lessons`)
    .where('start', '>=', startTs)
    .where('start', '<', endExclusiveTs)
    .get();

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as LessonData),
  }));
};
