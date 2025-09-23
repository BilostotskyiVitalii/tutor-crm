import type { FC } from 'react';
import { Link } from 'react-router-dom';

import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, type FormProps, Input } from 'antd';

import { navigationUrls } from '@/constants/navigationUrls';
import { useRegister } from '@/hooks/useRegister';
import type { IRegField } from '@/types/authFieldsTypes';

const RegistrationPage: FC = () => {
  const { register, loading } = useRegister();

  const handleRegister: FormProps<IRegField>['onFinish'] = register;

  return (
    <section className="auth-backdrop">
      <Form
        name="register"
        onFinish={handleRegister}
        className="form"
        scrollToFirstError
      >
        <h2 className="auth-form-title">Registration</h2>

        <Form.Item
          name="email"
          rules={[
            { type: 'email', message: 'The input is not valid E-mail!' },
            { required: true, message: 'Please input your E-mail!' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="E-mail" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm password"
          />
        </Form.Item>

        <Form.Item
          name="nickName"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: 'Please input your nickname!',
              whitespace: true,
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nickname" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
          or <Link to={navigationUrls.login}>Login now!</Link>
        </Form.Item>
      </Form>
    </section>
  );
};

export default RegistrationPage;
