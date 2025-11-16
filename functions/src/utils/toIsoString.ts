import { admin } from '../firebase';

export function fromTimestamp(value: unknown): string | null {
  if (value instanceof admin.firestore.Timestamp) {
    return value.toDate().toISOString();
  }
  return null;
}

export function toISOString<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof admin.firestore.Timestamp) {
    return fromTimestamp(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toISOString(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const out: Record<string, unknown> = {};

    for (const key of Object.keys(obj)) {
      const val = (obj as Record<string, unknown>)[key];

      if (val instanceof admin.firestore.Timestamp) {
        out[key] = fromTimestamp(val);
      } else {
        out[key] = toISOString(val);
      }
    }

    return out as T;
  }

  return obj;
}
