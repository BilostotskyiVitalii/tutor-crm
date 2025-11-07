import { db } from '../firebase';
import { Student, StudentData } from '../types/studentTypes';

export const fetchStudents = async (uid: string): Promise<Student[]> => {
  const snap = await db.collection(`users/${uid}/students`).get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as StudentData),
  }));
};
