import type { Rule } from 'antd/es/form';

export const validationRules: Record<string, Rule[]> = {
  email: [
    { required: true, message: 'Enter email' },
    { type: 'email', message: 'Wrong email format' },
  ],
  phone: [
    {
      pattern: /^\+\d{7,15}$/,
      message: 'Phone number must start with + and contain 7–15 digits',
    },
  ],
};
