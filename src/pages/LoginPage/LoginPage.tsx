import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { GoogleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Flex, Form, type FormProps, Input } from 'antd';

import { useGoogleLogin } from '@/features/user/hooks/useGoogleLogin';
import { useLogin } from '@/features/user/hooks/useLogin';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import type { LoginField } from '@/shared/types/authFieldsTypes';

import styles from './LoginPage.module.scss';

const LoginPage: FC = () => {
  const { login, loading } = useLogin();
  const { loginWithGoogle } = useGoogleLogin();
  const handleLogin: FormProps<LoginField>['onFinish'] = login;

  return (
    <section className="auth-backdrop">
      <Form
        className="form"
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
      >
        <h2 className="auth-form-title">Login</h2>
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
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
          <div className={styles.buttonsWrapper}>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Log in
            </Button>
            <Button
              block
              icon={<GoogleOutlined />}
              onClick={loginWithGoogle}
              loading={loading}
            >
              Log in with Google
            </Button>
          </div>
          or <Link to={navigationUrls.registration}>Register now!</Link>
        </Form.Item>
      </Form>
    </section>
  );
};

export default LoginPage;
