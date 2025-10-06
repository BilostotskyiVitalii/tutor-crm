import { type FC, useState } from 'react';

import { MailOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, message } from 'antd';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      message.success('Ссылка для сброса пароля отправлена на email.');
    } catch {
      message.error('Ошибка при отправке письма. Проверьте email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex className="auth-backdrop">
      <Form className="auth-form" name="forgot-password" onFinish={onFinish}>
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
