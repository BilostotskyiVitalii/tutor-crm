import type { FC } from 'react';
import styles from './UserMenuCard.module.scss';
import { useAppSelector } from '@/hooks/reduxHooks';

const UserMenuCard: FC = () => {
  const nickName = useAppSelector((state) => state.user.nickName);
  const email = useAppSelector((state) => state.user.email);

  return (
    <div className={styles.wrapper}>
      <p className={styles.nickname}>{nickName}</p>
      <p>{email}</p>
    </div>
  );
};

export default UserMenuCard;
