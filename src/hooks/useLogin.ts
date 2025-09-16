import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { navigationUrls } from '@/constants/navigationUrls';
import type { ILoginField } from '@/types/authFieldsTypes';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const login = async ({ email, password }: ILoginField) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(navigationUrls.index);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Ошибка при логине:', err);
      } else {
        setError('Неизвестная ошибка при логине');
        console.error('Неизвестная ошибка при логине:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
