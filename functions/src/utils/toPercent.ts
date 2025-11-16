export const toPercent = (part: number, total: number) =>
  total > 0 ? Math.round((part / total) * 100) : 0;
