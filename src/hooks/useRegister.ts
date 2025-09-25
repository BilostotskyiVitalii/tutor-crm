import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

import { navigationUrls } from '@/constants/navigationUrls';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { setUser } from '@/store/userSlice';
import type { RegField } from '@/types/authFieldsTypes';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const { handleError } = useErrorHandler();
  const dispatch = useAppDispatch();

  const register = async ({ email, password, nickName }: RegField) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await setDoc(doc(db, 'users', user.uid), {
        nickName,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;

      dispatch(
        setUser({
          id: user.uid,
          email: user.email,
          token,
          refreshToken,
          nickName,
          createdAt: Date.now(),
          avatar: null,
        }),
      );

      navigate(navigationUrls.index);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errMessage = handleError(err, 'Registration Error');
        setError(errMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
