export interface IStudentFormValues {
  name: string;
  email: string;
  age: number;
}

export interface IStudent extends IStudentFormValues {
  id: string;
  userId: string;
}

export type StudentData = Omit<IStudent, 'id'>;

export interface IUpdtUser {
  id: string;
  data: IStudentFormValues;
}
