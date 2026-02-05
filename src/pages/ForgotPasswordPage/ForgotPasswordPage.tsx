import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { MailOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input } from 'antd';

import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';

const ForgotPasswordPage: FC = () => {
  const { resetPassword, loading } = useForgotPassword();
  const { t } = useTranslation();

  const onFinish = (values: { email: string }) => {
    resetPassword(values.email);
  };

  return (
    <Flex className="auth-backdrop">
      <Form className="auth-form" name="forgot-password" onFinish={onFinish}>
        <h2 className="auth-form-title">{t('forgotPassword.title')}</h2>
        <Form.Item
          name="email"
          rules={[
            { type: 'email', message: 'Введите корректный email!' },
            { required: true, message: 'Введите email!' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            {t('forgotPassword.resetLink')}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default ForgotPasswordPage;
