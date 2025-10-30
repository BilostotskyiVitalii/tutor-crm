import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { setUser } from '@/features/user/api/userSlice';
import { axs } from '@/shared/api/axiosInstance';
import { endpointsURL } from '@/shared/constants/endpointsUrl';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useAppDispatch } from '@/store/reduxHooks';

interface LoginResponse {
  token: string; // Firebase ID token
  uid: string;
  email: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleError } = useErrorHandler();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axs.post<LoginResponse>(endpointsURL.apiLogin, {
        email,
        password,
      });

      dispatch(
        setUser({
          id: data.uid,
          email: data.email,
          token: data.token, // Firebase ID token
          nickName: data.email,
          createdAt: Date.now(),
          avatar: null,
          refreshToken: null,
        }),
      );

      navigate(navigationUrls.index);
    } catch (err: unknown) {
      setError(handleError(err, 'Login Error'));
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
