import { admin } from '../firebase';

type FirestoreSecNanoA = { _seconds: number; _nanoseconds?: number };
type FirestoreSecNanoB = { seconds: number; nanoseconds?: number };

const isAdminTimestamp = (v: unknown): v is FirebaseFirestore.Timestamp =>
  !!v && typeof v === 'object' && v instanceof admin.firestore.Timestamp;

const looksLikeSecNanoA = (v: unknown): v is FirestoreSecNanoA =>
  !!v &&
  typeof v === 'object' &&
  '_seconds' in v &&
  typeof (v as FirestoreSecNanoA)._seconds === 'number';

const looksLikeSecNanoB = (v: unknown): v is FirestoreSecNanoB =>
  !!v &&
  typeof v === 'object' &&
  'seconds' in v &&
  typeof (v as FirestoreSecNanoB).seconds === 'number';

/** Перетворює значення у ISO, коли МИ ВЖЕ ВИРІШИЛИ, що це поле-дата */
const toISOWhenDate = (v: unknown): string | null => {
  if (v === null) {
    return null;
  }
  if (v instanceof Date) {
    return isNaN(v.getTime()) ? null : v.toISOString();
  }
  if (typeof v === 'number') {
    return new Date(v).toISOString();
  }
  if (typeof v === 'string') {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  // Firestore Timestamp-подібні -> ISO (завжди)
  if (isAdminTimestamp(v)) {
    return v.toDate().toISOString();
  }
  if (looksLikeSecNanoA(v)) {
    const ms = v._seconds * 1000 + Math.floor((v._nanoseconds ?? 0) / 1e6);
    return new Date(ms).toISOString();
  }
  if (looksLikeSecNanoB(v)) {
    const ms = v.seconds * 1000 + Math.floor((v.nanoseconds ?? 0) / 1e6);
    return new Date(ms).toISOString();
  }
  return null;
};

/** За замовчуванням: тільки ключі, що схожі на дати */
const defaultDateKeyRegex =
  /(^createdAt$|^updatedAt$|^deletedAt$|^start$|^end$|^from$|^to$|^paidAt$|^due(Date)?$|Date$)/i;

export type DateKeyPredicate = (keyPath: string[], key: string) => boolean;

const defaultPredicate: DateKeyPredicate = (_path, key) => defaultDateKeyRegex.test(key);

/** Глибока мапа з селективною конвертацією */
export const mapTimestampsToISOSelective = <T>(
  data: T,
  isDateKey: DateKeyPredicate = defaultPredicate,
  keyPath: string[] = [],
): T => {
  // Масив
  if (Array.isArray(data)) {
    return data.map((item) =>
      mapTimestampsToISOSelective(item, isDateKey, keyPath),
    ) as unknown as T;
  }

  // Timestamp-подібні значення -> ISO
  if (isAdminTimestamp(data) || looksLikeSecNanoA(data) || looksLikeSecNanoB(data)) {
    return toISOWhenDate(data) as unknown as T;
  }

  // Примітиви залишаємо як є
  if (data === null || typeof data !== 'object') {
    return data;
  }

  // Plain object
  const record = data as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const [k, v] of Object.entries(record)) {
    const nextPath = [...keyPath, k];

    if (isAdminTimestamp(v) || looksLikeSecNanoA(v) || looksLikeSecNanoB(v)) {
      out[k] = toISOWhenDate(v);
      continue;
    }

    if (isDateKey(nextPath, k)) {
      const maybeISO = toISOWhenDate(v);
      out[k] = maybeISO ?? v;
    } else {
      out[k] = mapTimestampsToISOSelective(v, isDateKey, nextPath);
    }
  }

  return out as T;
};
