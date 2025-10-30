import { useState } from 'react';

import { axs } from '@/shared/api/axiosInstance';
import { endpointsURL } from '@/shared/constants/endpointsUrl';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axs.post(endpointsURL.apiResetPassword, { email });
      setSuccess('Reset email sent');
    } catch (err: unknown) {
      setError(handleError(err, 'Reset Password Error'));
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error, success };
};
