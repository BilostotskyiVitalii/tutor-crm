import { Divider } from 'antd';

import styles from './DividerVertical.module.scss';

export const DividerVertical = () => {
  return (
    <div>
      <Divider type="vertical" className={styles.divider} />
    </div>
  );
};
