import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuth, signInWithCustomToken } from 'firebase/auth';

import { setUser } from '@/features/user/api/userSlice';
import { axs } from '@/shared/api/axiosInstance';
import { endpointsURL } from '@/shared/constants/endpointsUrl';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useAppDispatch } from '@/store/reduxHooks';

interface LoginResponse {
  token: string;
  uid: string;
  email: string;
  nickName?: string;
  avatar?: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleError } = useErrorHandler();
  const auth = getAuth();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axs.post<LoginResponse>(endpointsURL.apiLogin, {
        email,
        password,
      });

      await signInWithCustomToken(auth, data.token);

      dispatch(
        setUser({
          id: data.uid,
          email: data.email,
          token: data.token,
          nickName: data.nickName ?? null,
          createdAt: null,
          avatar: data.avatar ?? null,
          refreshToken: null,
        }),
      );

      navigate(navigationUrls.index);
    } catch (err) {
      setError(handleError(err, 'Login Error'));
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
