import type { FC } from 'react';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import styles from './UserMenuCard.module.scss';

const UserMenuCard: FC = () => {
  const { profile } = useAuthProfile();

  return (
    <div className={styles.wrapper}>
      <p className={styles.nickname}>{profile?.nickName}</p>
      <p>{profile?.email}</p>
    </div>
  );
};

export default UserMenuCard;
