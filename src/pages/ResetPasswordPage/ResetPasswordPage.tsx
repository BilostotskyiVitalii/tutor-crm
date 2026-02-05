import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { LockOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input } from 'antd';

import { useResetPassword } from '@/features/auth/hooks/useResetPassword';

const ResetPasswordPage: FC = () => {
  const { handleResetPassword, isLoading, error } = useResetPassword();
  const { t } = useTranslation();

  return (
    <Flex className="auth-backdrop">
      <Form
        className="auth-form"
        name="reset-password"
        onFinish={handleResetPassword}
      >
        <h2 className="auth-form-title">{t('reset.title')}</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: `${t('validation.enterNewPass')}` },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('placeholders.newPassword')}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: `${t('validation.confirmNewPass')}` },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('placeholders.confirmPass')}
          />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={isLoading}>
            {t('reset.button')}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default ResetPasswordPage;
