import { useNavigate } from 'react-router-dom';

import { useRegisterMutation } from '@/features/auth/api/authApi';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export const useRegister = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [registerMutation, { isLoading, error }] = useRegisterMutation();

  const register = async (
    email: string,
    password: string,
    nickName: string,
  ) => {
    try {
      await registerMutation({
        email,
        password,
        nickName,
      }).unwrap();
      navigate(navigationUrls.index);
    } catch (err: unknown) {
      handleError(err, 'Registration Error');
    }
  };

  return { register, loading: isLoading, error };
};
