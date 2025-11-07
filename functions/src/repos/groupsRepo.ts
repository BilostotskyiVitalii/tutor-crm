import { db } from '../firebase';
import { Group, GroupData } from '../types/groupTypes';

export const fetchGroups = async (uid: string): Promise<Group[]> => {
  const snap = await db.collection(`users/${uid}/groups`).get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as GroupData),
  }));
};
