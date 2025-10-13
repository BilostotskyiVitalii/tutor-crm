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
