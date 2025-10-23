export function toNullData<T extends Record<string, unknown>>(
  formValues: T,
): T {
  const mappedEntries = Object.entries(formValues).map(([key, value]) => [
    key,
    value === undefined || (typeof value === 'string' && value.trim() === '')
      ? null
      : value,
  ]) as [keyof T, T[keyof T]][];

  return Object.fromEntries(mappedEntries) as T;
}
