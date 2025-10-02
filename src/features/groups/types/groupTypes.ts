export interface Group {
  id: string;
  title: string;
  studentIds: string[];
  notes: string | null;
  price: number;
  createdAt: number;
  updatedAt: number;
}

export type GroupData = Omit<Group, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateGroup = {
  id: string;
  data: Partial<GroupData>;
};

export type ModalState =
  | { type: 'group'; groupId: string | null }
  | { type: 'lesson'; groupId: string }
  | null;

export interface GroupFormProps {
  isModalOpen: boolean;
  onClose: () => void;
  editedGroupId: string | null;
}
