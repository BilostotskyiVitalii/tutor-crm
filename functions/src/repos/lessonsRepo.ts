import { db } from '../firebase';
import { Lesson, LessonData } from '../types/lessonTypes';

export const fetchLessonsForRange = async (
  userPath: string,
  startTs: FirebaseFirestore.Timestamp,
  endExclusiveTs: FirebaseFirestore.Timestamp,
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
