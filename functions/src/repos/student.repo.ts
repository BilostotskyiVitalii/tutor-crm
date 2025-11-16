import { db } from '../firebase';
import { Student, StudentData } from '../types/studentTypes';

export const StudentRepo = {
  getAll: async (uid: string): Promise<Student[]> => {
    const snap = await db.collection(`users/${uid}/students`).get();
    return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as StudentData) }));
  },

  getById: async (uid: string, id: string): Promise<Student | null> => {
    const doc = await db.doc(`users/${uid}/students/${id}`).get();
    return doc.exists ? { id: doc.id, ...(doc.data() as StudentData) } : null;
  },

  create: (uid: string, payload: StudentData) =>
    db.collection(`users/${uid}/students`).add(payload),

  update: (uid: string, id: string, payload: Partial<StudentData>) =>
    db.doc(`users/${uid}/students/${id}`).update(payload),

  delete: (uid: string, id: string) => db.doc(`users/${uid}/students/${id}`).delete(),
};
