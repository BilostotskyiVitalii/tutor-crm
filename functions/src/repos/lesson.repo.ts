import { Timestamp } from 'firebase-admin/firestore';

import { db } from '../firebase';
import { Lesson, LessonData } from '../types/lessonTypes';

export const LessonRepo = {
  getAll: async (uid: string): Promise<Lesson[]> => {
    const snap = await db.collection(`users/${uid}/lessons`).get();
    return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as LessonData) }));
  },

  getById: async (uid: string, id: string): Promise<Lesson | null> => {
    const doc = await db.doc(`users/${uid}/lessons/${id}`).get();
    return doc.exists ? { id: doc.id, ...(doc.data() as LessonData) } : null;
  },

  getByRange: async (uid: string, start: Timestamp, end: Timestamp): Promise<Lesson[]> => {
    const snap = await db
      .collection(`users/${uid}/lessons`)
      .where('start', '>=', start)
      .where('start', '<', end)
      .get();
    return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as LessonData) }));
  },

  create: (uid: string, payload: LessonData) => db.collection(`users/${uid}/lessons`).add(payload),

  update: (uid: string, id: string, payload: Partial<LessonData>) =>
    db.doc(`users/${uid}/lessons/${id}`).update(payload),

  delete: (uid: string, id: string) => db.doc(`users/${uid}/lessons/${id}`).delete(),
};
