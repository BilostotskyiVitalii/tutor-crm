import type { FC } from 'react';

import { Select } from 'antd';

import styles from './SelectLang.module.scss';

const langOptions = [
  { value: 'en', label: 'EN' },
  { value: 'uk', label: 'UA' },
  { value: 'ru', label: 'RU' },
];

const SelectLang: FC = () => {
  return (
    <Select
      className={styles.wrapper}
      defaultValue="en"
      variant="borderless"
      options={langOptions.map((option) => ({
        value: option.value,
        label: option.label,
      }))}
    />
  );
};

export default SelectLang;
