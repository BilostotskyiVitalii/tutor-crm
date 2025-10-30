import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { GoogleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Flex, Form, type FormProps, Input } from 'antd';

import { useGoogleLogin } from '@/features/auth/hooks/useGoogleLogin';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import type { LoginField } from '@/shared/types/authFieldsTypes';

import styles from './LoginPage.module.scss';

const LoginPage: FC = () => {
  const { login, loading } = useLogin();
  const { googleLogin } = useGoogleLogin();
  const handleLogin: FormProps<LoginField>['onFinish'] = (values) => {
    login(values.email, values.password);
  };

  return (
    <Flex className="auth-backdrop">
      <Form className="auth-form" name="login" onFinish={handleLogin}>
        <h2 className="auth-form-title">Login</h2>

        <Form.Item
          name="email"
          hasFeedback
          rules={[
            { type: 'email', message: 'The input is not valid E-mail!' },
            { required: true, message: 'Please input your E-mail!' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="E-mail" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center">
            <Link to={navigationUrls.forgotPassword}>Forgot password?</Link>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Flex className={styles.buttonsWrapper}>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Log in
            </Button>
            <Button
              block
              icon={<GoogleOutlined />}
              onClick={googleLogin}
              loading={loading}
            >
              Log in with Google
            </Button>
          </Flex>
          or <Link to={navigationUrls.registration}>Register now!</Link>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default LoginPage;
