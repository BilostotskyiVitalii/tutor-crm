import { useState } from 'react';

import { message } from 'antd';

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
      const res = await fetch(
        `${endpointsURL.apiBaseUrl}/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        },
      );

      const data = (await res.json()) as { message?: string };

      if (!res.ok) {
        throw new Error(data.message || 'Reset password failed');
      }

      message.success('Ссылка для сброса пароля отправлена на email.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(handleError(err, 'Reset Password Error'));
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error };
};
