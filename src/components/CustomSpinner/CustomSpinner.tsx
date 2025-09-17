import { Spin } from 'antd';
import styles from './CustomSpinner.module.scss';

const CustomSpinner = () => {
  return (
    <div className={styles.container}>
      <Spin size="large" />
    </div>
  );
};

export default CustomSpinner;
