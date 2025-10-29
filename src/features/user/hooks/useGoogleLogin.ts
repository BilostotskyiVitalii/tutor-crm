import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithCustomToken,
  signInWithPopup,
} from 'firebase/auth';

import { setUser } from '@/features/user/api/userSlice';
import { endpointsURL } from '@/shared/constants/endpointsUrl';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useAppDispatch } from '@/store/reduxHooks';

interface GoogleLoginResponse {
  token: string;
  uid: string;
  email: string;
  nickName?: string;
}

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleError } = useErrorHandler();
  const auth = getAuth();

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      // Логин через Google Popup
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Отправляем ID Token на backend
      const res = await fetch(`${endpointsURL.apiBaseUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData?.message || 'Google login failed');
      }

      const data = resData as GoogleLoginResponse;

      // Входим в Firebase через Custom Token
      await signInWithCustomToken(auth, data.token);

      // Сохраняем пользователя в Redux
      dispatch(
        setUser({
          id: data.uid,
          email: data.email,
          token: data.token,
          nickName: data.nickName ?? result.user.displayName ?? null,
          createdAt: Date.now(),
          avatar: result.user.photoURL ?? null,
          refreshToken: null,
        }),
      );

      navigate(navigationUrls.index);
    } catch (err: unknown) {
      setError(handleError(err, 'Google Login Error'));
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading, error };
};
