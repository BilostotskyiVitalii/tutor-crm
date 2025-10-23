function isToDateLike(value: unknown): value is { toDate: () => Date } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  );
}

function normalizeDateToTime(value: unknown): number | undefined {
  if (value === null) {
    return undefined;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === 'string') {
    const t = new Date(value).getTime();
    return isNaN(t) ? undefined : t;
  }
  if (isToDateLike(value)) {
    return value.toDate().getTime();
  }
  return undefined;
}

function arraysEqual<T>(a?: T[], b?: T[]): boolean {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  return a.every((v, i) => v === b[i]);
}

export function getChangedFields<T extends Record<string, unknown>>(
  newData: T,
  oldData: Partial<T> | null | undefined,
): Partial<T> {
  if (!oldData) {
    return newData;
  }

  const changed: Partial<T> = {};

  for (const key of Object.keys(newData) as (keyof T)[]) {
    const newValue = newData[key];
    const oldValue = oldData[key];

    // 🔹 масиви
    if (Array.isArray(newValue) && Array.isArray(oldValue)) {
      if (!arraysEqual(newValue, oldValue)) {
        changed[key] = newValue;
      }
      continue;
    }

    // 🔹 дати / timestamp-подібні
    const newTime = normalizeDateToTime(newValue);
    const oldTime = normalizeDateToTime(oldValue);
    if (newTime !== undefined && oldTime !== undefined) {
      if (newTime !== oldTime) {
        changed[key] = newValue;
      }
      continue;
    }

    // 🔹 інші значення
    if (newValue !== oldValue) {
      changed[key] = newValue;
    }
  }

  return changed;
}
