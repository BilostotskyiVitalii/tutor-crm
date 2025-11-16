import { Timestamp } from 'firebase-admin/firestore';

export const toTimestamp = (value: number | string | Date): Timestamp => {
  if (value instanceof Date) {
    return Timestamp.fromDate(value);
  }

  if (typeof value === 'number') {
    return Timestamp.fromMillis(value);
  }

  const d = new Date(value);
  return Timestamp.fromDate(d);
};
