import { admin } from '../firebase';

export const toTimestamp = (v: unknown) => {
  if (v === null) {
    return null;
  }
  if (typeof v === 'number') {
    return admin.firestore.Timestamp.fromMillis(v);
  }
  if (v instanceof Date) {
    return admin.firestore.Timestamp.fromDate(v);
  }
  if (typeof v === 'string' && /^\d+$/.test(v)) {
    return admin.firestore.Timestamp.fromMillis(Number(v));
  }
  return v;
};
