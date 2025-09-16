import type { FC } from 'react';
import { Link } from 'react-router';
import { Button, Flex, Form, Input, type FormProps } from 'antd';
import { GoogleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

import { navigationUrls } from '@/constants/navigationUrls';
import type { ILoginField } from '@/types/authFieldsTypes';
import { useLogin } from '@/hooks/useLogin';
import { useGoogleLogin } from '@/hooks/useGoogleLogin';

const LoginPage: FC = () => {
  const { login } = useLogin();
  const { loginWithGoogle } = useGoogleLogin();
  const handleLogin: FormProps<ILoginField>['onFinish'] = login;

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
            <a href="">Forgot password</a>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
          <Button block icon={<GoogleOutlined />} onClick={loginWithGoogle}>
            Log in with Google
          </Button>
          or <Link to={navigationUrls.registration}>Register now!</Link>
        </Form.Item>
      </Form>
    </section>
  );
};

export default LoginPage;
