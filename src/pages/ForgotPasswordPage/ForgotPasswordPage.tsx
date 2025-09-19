import { type FC, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      message.success('Ссылка для сброса пароля отправлена на email.');
    } catch (err) {
      message.error('Ошибка при отправке письма. Проверьте email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-backdrop">
      <Form className="form" name="forgot-password" onFinish={onFinish}>
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
    </section>
  );
};

export default ForgotPasswordPage;
