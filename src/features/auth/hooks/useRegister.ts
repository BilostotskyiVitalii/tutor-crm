import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useRegisterMutation } from '@/features/auth/api/authApi';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export const useRegister = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [registerMutation, { isLoading, error }] = useRegisterMutation();
  const { t } = useTranslation();

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
      handleError(err, `${t('registration.error')}`);
    }
  };

  return { register, loading: isLoading, error };
};
