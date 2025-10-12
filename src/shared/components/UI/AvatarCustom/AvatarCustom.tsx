import type { FC } from 'react';

import { Avatar } from 'antd';

import { getAvatarColorClass } from '@/shared/utils/getAvatarColorClass';

import styles from './AvatarCustom.module.scss';

interface AvatarCustomProps {
  src: string | null;
  name: string;
  inactive?: boolean;
  className?: string;
}

const AvatarCustom: FC<AvatarCustomProps> = ({
  src,
  name,
  inactive,
  className,
}) => {
  const active = inactive ?? true;

  return (
    <Avatar
      src={src}
      className={`${className} ${styles.avatar} ${
        active ? getAvatarColorClass(name) : styles.avatarInactive
      }`}
    >
      {name[0]}
    </Avatar>
  );
};

export default AvatarCustom;
