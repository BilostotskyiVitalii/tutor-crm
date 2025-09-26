import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { setUser } from '@/features/user/userSlice';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import type { LoginField } from '@/shared/types/authFieldsTypes';
import { useAppDispatch } from '@/store/reduxHooks';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const { handleError } = useErrorHandler();
  const dispatch = useAppDispatch();

  const login = async ({ email, password }: LoginField) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
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
      }
      navigate(navigationUrls.index);
    } catch (err: unknown) {
      const errMessage = handleError(err, 'Login Error');
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
