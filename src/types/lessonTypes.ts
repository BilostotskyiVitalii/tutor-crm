export interface ILesson {
  id: string;
  type: 'individual' | 'group';
  tutorId: string;
  studentId?: string;
  groupId?: string;
  studentIds?: string[];
  start: string;
  end: string;
  title?: string;
  notes?: string;
}

export interface IGroup {
  id: string;
  tutorId: string;
  name: string;
  notes?: string;
  studentIds: string[];
}
