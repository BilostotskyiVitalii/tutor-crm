// src/features/auth/hooks/useResetPassword.ts
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { message } from 'antd';

import { useConfirmResetPasswordMutation } from '@/features/auth/api/authApi';

interface ResetPasswordValues {
  newPassword: string;
  confirmPassword: string;
}

export const useResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [confirmResetPassword, { isLoading }] =
    useConfirmResetPasswordMutation();
  const [error, setError] = useState<string | null>(null);

  const oobCode = searchParams.get('oobCode');

  const handleResetPassword = async (values: ResetPasswordValues) => {
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

  return {
    isLoading,
    error,
    handleResetPassword,
  };
};
