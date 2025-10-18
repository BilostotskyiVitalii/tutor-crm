import { admin } from '../firebase';

export const nowTs = () => admin.firestore.Timestamp.now();
export const monthRange = (d = new Date()) => {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const endExclusive = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return {
    startTs: admin.firestore.Timestamp.fromDate(start),
    endExclusiveTs: admin.firestore.Timestamp.fromDate(endExclusive),
  };
};
