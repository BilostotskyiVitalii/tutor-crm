import { useResetPasswordMutation } from '@/features/auth/api/authApi';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export const useResetPassword = () => {
  const { handleError } = useErrorHandler();
  const [resetPasswordMutation, { isLoading, error, data }] =
    useResetPasswordMutation();

  const resetPassword = async (email: string) => {
    try {
      await resetPasswordMutation({ email }).unwrap();
    } catch (err: unknown) {
      handleError(err, 'Reset Password Error');
    }
  };

  const success = data ? 'Reset email sent' : null;

  return { resetPassword, loading: isLoading, error, success };
};
