import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { setUser } from '@/features/user/api/userSlice';
import { axs } from '@/shared/api/axiosInstance';
import { endpointsURL } from '@/shared/constants/endpointsUrl';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useAppDispatch } from '@/store/reduxHooks';

interface RegisterResponse {
  token: string;
  uid: string;
  email: string;
  nickName?: string;
}

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleError } = useErrorHandler();

  const register = async (
    email: string,
    password: string,
    nickName: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axs.post<RegisterResponse>(
        endpointsURL.apiRegister,
        { email, password, nickName },
      );

      dispatch(
        setUser({
          id: data.uid,
          email: data.email,
          token: data.token,
          nickName: data.nickName ?? nickName,
          createdAt: Date.now(),
          avatar: null,
          refreshToken: null,
        }),
      );

      navigate(navigationUrls.index);
    } catch (err: unknown) {
      setError(handleError(err, 'Registration Error'));
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
