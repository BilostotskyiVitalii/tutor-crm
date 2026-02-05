import { useTranslation } from 'react-i18next';

import { useResetPasswordMutation } from '@/features/auth/api/authApi';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export const useForgotPassword = () => {
  const { handleError } = useErrorHandler();
  const [resetPasswordMutation, { isLoading, error, data }] =
    useResetPasswordMutation();
  const { t } = useTranslation();

  const resetPassword = async (email: string) => {
    try {
      await resetPasswordMutation({ email }).unwrap();
    } catch (err: unknown) {
      handleError(err, `${t('reset.error')}`);
    }
  };

  const success = data ? `${t('reset.emailSent')}` : null;

  return { resetPassword, loading: isLoading, error, success };
};
