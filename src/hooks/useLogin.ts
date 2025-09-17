import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { navigationUrls } from '@/constants/navigationUrls';
import type { ILoginField } from '@/types/authFieldsTypes';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const { handleError } = useErrorHandler();

  const login = async ({ email, password }: ILoginField) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
