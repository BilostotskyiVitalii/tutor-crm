import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Select } from 'antd';

import styles from './SelectLang.module.scss';

const langOptions = [
  { value: 'en', label: 'EN' },
  { value: 'uk', label: 'UA' },
  { value: 'ru', label: 'RU' },
];

const SelectLang: FC = () => {
  const { i18n } = useTranslation();

  return (
    <Select
      className={styles.wrapper}
      value={i18n.language}
      variant="borderless"
      onChange={(lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('lang', lng);
      }}
      options={langOptions}
    />
  );
};

export default SelectLang;
