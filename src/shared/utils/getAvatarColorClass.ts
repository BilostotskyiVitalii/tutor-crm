export const getAvatarColorClass = (str: string): string => {
  const colorsCount = 8; // $avatar-colors length
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `avatar-color-${Math.abs(hash) % colorsCount}`;
};
