import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithCustomToken,
  signInWithPopup,
} from 'firebase/auth';

import { setUser } from '@/features/user/api/userSlice';
import { axs } from '@/shared/api/axiosInstance';
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
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const { data } = await axs.post<GoogleLoginResponse>(
        endpointsURL.apiGoogleLogin,
        { idToken },
      );

      await signInWithCustomToken(auth, data.token);

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
    } catch (err) {
      setError(handleError(err, 'Google Login Error'));
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading, error };
};
