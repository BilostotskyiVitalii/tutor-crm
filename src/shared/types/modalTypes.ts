import type { Group } from '@/features/groups/types/groupTypes';
import type { Lesson } from '@/features/lessons/types/lessonTypes';
import type { Student } from '@/features/students/types/studentTypes';

export type ModalType = 'lesson' | 'group' | 'student' | null;
export type ModeType = 'create' | 'edit';

export type initDataType = {
  initStudent?: Student | null;
  initGroup?: Group | null;
  initStart?: Date | null;
  initEnd?: Date | null;
};

type BaseState = {
  open: boolean;
  mode?: ModeType;
  initData?: initDataType;
};

type GroupModal = BaseState & { type: 'group'; entity: Group | null };
type LessonModal = BaseState & { type: 'lesson'; entity: Lesson | null };
type StudentModal = BaseState & { type: 'student'; entity: Student | null };
type NoneModal = BaseState & { type: null; entity: null };

export type ModalState = GroupModal | LessonModal | StudentModal | NoneModal;

export type GroupOpenOptions = Omit<
  Extract<ModalState, { type: 'group' }>,
  'open'
>;
export type LessonOpenOptions = Omit<
  Extract<ModalState, { type: 'lesson' }>,
  'open'
>;
export type StudentOpenOptions = Omit<
  Extract<ModalState, { type: 'student' }>,
  'open'
>;

export type OpenModalOptions =
  | GroupOpenOptions
  | LessonOpenOptions
  | StudentOpenOptions;
