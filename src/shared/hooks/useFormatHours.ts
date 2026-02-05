import { useTranslation } from 'react-i18next';

export const useFormatHours = () => {
  const { t } = useTranslation();

  return (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);

    if (h > 0 && m > 0) {
      return `${h}${t('hour')} ${m}${t('minute')}`;
    }
    if (h > 0) {
      return t('hour', { h });
    }
    if (m > 0) {
      return t('minute', { m });
    }
    return '0';
  };
};
