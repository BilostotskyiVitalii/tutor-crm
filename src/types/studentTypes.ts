export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  age: number;
}

export type StudentFormValues = Omit<Student, 'id' | 'userId'>;

export type StudentData = Omit<Student, 'id'>;

export type UpdateUser = {
  id: string;
  data: Partial<Student>;
};

export interface StudentsGroup {
  id: string;
  tutorId: string;
  name: string;
  notes?: string;
  studentIds: string[];
}
