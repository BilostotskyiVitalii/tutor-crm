import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { setUser } from '@/features/user/userSlice';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useAppDispatch } from '@/store/reduxHooks';

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const { handleError } = useErrorHandler();
  const dispatch = useAppDispatch();

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;
      dispatch(
        setUser({
          id: user.uid,
          email: user.email,
          token,
          refreshToken,
          nickName: user.displayName ?? null,
          createdAt: null,
          avatar: user.photoURL ?? null,
        }),
      );

      navigate(navigationUrls.index);
    } catch (err: unknown) {
      const errMessage = handleError(err, 'Login Error');
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading, error };
};
