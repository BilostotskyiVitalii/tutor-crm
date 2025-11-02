import { type FC, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { LockOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, message } from 'antd';

import { useConfirmResetPasswordMutation } from '@/features/auth/api/authApi';

const ResetPasswordPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [confirmResetPassword, { isLoading }] =
    useConfirmResetPasswordMutation();
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);

  const oobCode = searchParams.get('oobCode');

  const onFinish = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (!oobCode) {
      setError('Invalid or missing reset code.');
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      await confirmResetPassword({
        oobCode,
        newPassword: values.newPassword,
      }).unwrap();
      message.success('Password successfully reset!');
      navigate('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data?: { message?: string } }).data?.message ===
          'string'
      ) {
        setError((err as { data: { message: string } }).data.message);
      } else {
        setError('Failed to reset password');
      }
    }
  };

  return (
    <Flex className="auth-backdrop">
      <Form
        form={form}
        className="auth-form"
        name="reset-password"
        onFinish={onFinish}
      >
        <h2 className="auth-form-title">Reset Password</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Form.Item
          name="newPassword"
          rules={[{ required: true, message: 'Enter new password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="New password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: 'Confirm new password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm password"
          />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={isLoading}>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default ResetPasswordPage;
