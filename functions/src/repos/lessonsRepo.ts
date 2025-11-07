import { Timestamp } from 'firebase-admin/firestore';

import { db } from '../firebase';
import { Lesson, LessonData } from '../types/lessonTypes';

export const fetchLessonsForRange = async (
  uid: string,
  startTs: Timestamp,
  endExclusiveTs: Timestamp,
): Promise<Lesson[]> => {
  const snap = await db
    .collection(`users/${uid}/lessons`)
    .where('start', '>=', startTs)
    .where('start', '<', endExclusiveTs)
    .get();

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as LessonData),
  }));
};
