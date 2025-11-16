import { db } from '../firebase';
import { Group, GroupData } from '../types/groupTypes';

export const GroupRepo = {
  getAll: async (uid: string): Promise<Group[]> => {
    const snap = await db.collection(`users/${uid}/groups`).get();
    return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as GroupData) }));
  },

  getById: async (uid: string, id: string): Promise<Group | null> => {
    const doc = await db.doc(`users/${uid}/groups/${id}`).get();
    return doc.exists ? { id: doc.id, ...(doc.data() as GroupData) } : null;
  },

  create: (uid: string, payload: GroupData) => db.collection(`users/${uid}/groups`).add(payload),

  update: (uid: string, id: string, payload: Partial<GroupData>) =>
    db.doc(`users/${uid}/groups/${id}`).update(payload),

  delete: (uid: string, id: string) => db.doc(`users/${uid}/groups/${id}`).delete(),
};
