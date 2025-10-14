export function normalizeNulls<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === undefined || value === '' ? null : value,
    ]),
  ) as T;
}
