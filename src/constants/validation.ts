import type { Rule } from 'antd/es/form';

export const studentFormRules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Enter name' }],
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
  cost: [{ required: true, message: 'Enter cost/hour' }],
  level: [{ required: true, message: 'Choose student level' }],
};
