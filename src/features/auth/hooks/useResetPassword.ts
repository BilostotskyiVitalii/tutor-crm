import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { message } from 'antd';

import { useConfirmResetPasswordMutation } from '@/features/auth/api/authApi';
import { navigationUrls } from '@/shared/constants/navigationUrls';

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
  const { t } = useTranslation();

  const oobCode = searchParams.get('oobCode');

  const handleResetPassword = async (values: ResetPasswordValues) => {
    if (!oobCode) {
      setError(`${t('reset.invalidCode')}`);
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      setError(`${t('validation.notMatchPass')}`);
      return;
    }

    try {
      await confirmResetPassword({
        oobCode,
        newPassword: values.newPassword,
      }).unwrap();

      message.success(`${t('reset.success')}`);
      navigate(navigationUrls.login);
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
        setError(`${t('reset.error')}`);
      }
    }
  };

  return {
    isLoading,
    error,
    handleResetPassword,
  };
};
