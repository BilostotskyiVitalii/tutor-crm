import { db } from '../firebase';
import { Student, StudentData } from '../types/studentTypes';

export const fetchStudents = async (userPath: string): Promise<Student[]> => {
  const snap = await db.collection(`${userPath}/students`).get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as StudentData),
  }));
};
