export function normalizeData<T extends Record<string, unknown>>(
  formValues: T,
): T {
  const entries = Object.entries(formValues) as [keyof T, T[keyof T]][];

  const mapped = entries.map(([key, value]) => [
    key,
    value === undefined || (typeof value === 'string' && value === '')
      ? null
      : value,
  ]) as [keyof T, T[keyof T]][];

  return Object.fromEntries(mapped) as T;
}
