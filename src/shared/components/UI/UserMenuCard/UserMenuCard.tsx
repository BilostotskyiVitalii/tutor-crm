import { useAppSelector } from '@/store/reduxHooks';

import styles from './UserMenuCard.module.scss';

export const UserMenuCard = () => {
  const nickName = useAppSelector((state) => state.auth.nickName);
  const email = useAppSelector((state) => state.auth.email);

  return (
    <div className={styles.wrapper}>
      <p className={styles.nickname}>{nickName}</p>
      <p>{email}</p>
    </div>
  );
};
