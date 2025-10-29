import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuth, signInWithCustomToken } from 'firebase/auth';

import { setUser } from '@/features/user/api/userSlice';
import { endpointsURL } from '@/shared/constants/endpointsUrl';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useAppDispatch } from '@/store/reduxHooks';

interface RegisterResponse {
  token: string;
  uid: string;
  email: string;
}

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleError } = useErrorHandler();
  const auth = getAuth();

  const register = async (
    email: string,
    password: string,
    nickName: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${endpointsURL.apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickName }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData?.message || 'Registration failed');
      }

      const data = resData as RegisterResponse;

      await signInWithCustomToken(auth, data.token);

      dispatch(
        setUser({
          id: data.uid,
          email: data.email,
          token: data.token,
          nickName,
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
