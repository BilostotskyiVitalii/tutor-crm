import { type FC } from 'react';

import { MailOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input } from 'antd';

import { useResetPassword } from '@/features/auth/hooks/useResetPassword';

const ForgotPasswordPage: FC = () => {
  const { resetPassword, loading } = useResetPassword();

  return (
    <Flex className="auth-backdrop">
      <Form
        className="auth-form"
        name="forgot-password"
        onFinish={resetPassword}
      >
        <h2 className="auth-form-title">Forgot Password</h2>
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
            Send reset link
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default ForgotPasswordPage;
