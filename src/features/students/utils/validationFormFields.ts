import type { Rule } from 'antd/es/form';

export const getStudentFormRules = (
  t: (key: string) => string,
): Record<string, Rule[]> => ({
  name: [{ required: true, message: t('validation.enterName') }],
  email: [
    { required: true, message: t('validation.enterEmail') },
    { type: 'email', message: t('validation.wrongEmailFormat') },
  ],
  phone: [
    {
      pattern: /^\+\d{7,15}$/,
      message: t('validation.phoneFormat'),
    },
  ],
  price: [{ required: true, message: t('validation.enterPrice') }],
  level: [{ required: true, message: t('validation.chooseLevel') }],
});
