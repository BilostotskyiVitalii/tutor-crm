import { useNavigate } from 'react-router-dom';

import { useLoginMutation } from '@/features/auth/api/authApi';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export const useLogin = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [loginMutation, { isLoading, error }] = useLoginMutation();

  const login = async (email: string, password: string) => {
    try {
      await loginMutation({ email, password }).unwrap();
      navigate(navigationUrls.index);
    } catch (err: unknown) {
      handleError(err, 'Login Error');
    }
  };

  return { login, loading: isLoading, error };
};
