import { useState } from 'react';

import { message } from 'antd';

import { axs } from '@/shared/api/axiosInstance';
import { endpointsURL } from '@/shared/constants/endpointsUrl';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await axs.post(endpointsURL.apiResetPassword, { email });

      message.success('Ссылка для сброса пароля отправлена на email.');
    } catch (err) {
      setError(handleError(err, 'Reset Password Error'));
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error };
};
