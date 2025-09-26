export const getAvatarColorClass = (str: string): string => {
  const colorsCount = 8; // столько же, сколько в $avatar-colors
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `avatar-color-${Math.abs(hash) % colorsCount}`;
};
