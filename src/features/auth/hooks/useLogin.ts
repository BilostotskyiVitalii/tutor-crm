import { useNavigate } from 'react-router-dom';

import { useLoginMutation } from '@/features/auth/api/authApi';
import { setUser } from '@/features/auth/api/authSlice';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useAppDispatch } from '@/store/reduxHooks';

export const useLogin = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const login = async (email: string, password: string) => {
    try {
      const user = await loginMutation({ email, password }).unwrap();
      dispatch(setUser(user));
      navigate(navigationUrls.index);
    } catch (err: unknown) {
      handleError(err, 'Login Error');
    }
  };

  return { login, loading: isLoading, error };
};
