export const formatHours = (hours: number) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  if (h > 0 && m > 0) {
    return `${h}h ${m}min`;
  } else if (h > 0) {
    return `${h}h`;
  } else if (m > 0) {
    return `${m}min`;
  } else {
    return '0';
  }
};
