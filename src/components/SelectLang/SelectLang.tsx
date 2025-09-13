import { type FC, useState, useRef, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import styles from './SelectLang.module.scss';

const options = [
  { value: 'en', label: 'EN' },
  { value: 'ru', label: 'RU' },
  { value: 'ua', label: 'UA' },
];

const SelectLang: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === language);

  return (
    <div ref={ref} className={styles.wrapper}>
      <div className={styles.title} onClick={() => setIsOpen((prev) => !prev)}>
        <span className={styles.titleLabel}>{selectedOption?.label}</span>
        <DownOutlined
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : styles.arrowClose}`}
        />
      </div>

      {isOpen && (
        <div className={styles.optionsList}>
          {options.map((option) => (
            <div
              className={`${styles.option} ${option.value === language ? styles.optionSelected : ''}`}
              key={option.value}
              onClick={() => {
                setLanguage(option.value);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectLang;
