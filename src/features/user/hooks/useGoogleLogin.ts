import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from '@/app/firebase';
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
}

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleError } = useErrorHandler();

  const googleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const { data } = await axs.post<GoogleLoginResponse>(
        endpointsURL.apiGoogleLogin,
        { idToken },
      );

      dispatch(
        setUser({
          id: data.uid,
          email: data.email,
          token: data.token,
          nickName: result.user.displayName ?? data.email,
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

  return { googleLogin, loading, error };
};
