export interface Group {
  id: string;
  title: string;
  studentIds: string[];
  notes: string;
}

export type GroupData = Omit<Group, 'id'>;

export type UpdateGroup = {
  id: string;
  data: Partial<GroupData>;
};
