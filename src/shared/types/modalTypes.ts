export type ModalType = 'lesson' | 'group' | 'student' | null;
export type ModeType = 'create' | 'edit';

export type initDataType = {
  initStudent?: string | null;
  initGroup?: string | null;
  initStart?: Date | null;
  initEnd?: Date | null;
};

export interface ModalState {
  open: boolean;
  type: ModalType;
  mode?: ModeType;
  entityId?: string | null;
  initData?: initDataType;
}
