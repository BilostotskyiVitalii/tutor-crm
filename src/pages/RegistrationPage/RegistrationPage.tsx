import type { FC } from 'react';
import { Link } from 'react-router-dom';

import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Form, type FormProps, Input } from 'antd';

import { useRegister } from '@/features/user/hooks/useRegister';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import type { RegField } from '@/shared/types/authFieldsTypes';

const RegistrationPage: FC = () => {
  const { register, loading } = useRegister();

  const handleRegister: FormProps<RegField>['onFinish'] = register;

  return (
    <Flex className="auth-backdrop">
      <Form name="register" onFinish={handleRegister} className="auth-form">
        <h2 className="auth-form-title">Registration</h2>

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
          hasFeedback
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
          ]}
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
          hasFeedback
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
    </Flex>
  );
};

export default RegistrationPage;
