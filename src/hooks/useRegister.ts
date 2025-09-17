import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, serverTimestamp, set } from 'firebase/database';
import { navigationUrls } from '@/constants/navigationUrls';
import type { IRegField } from '@/types/authFieldsTypes';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();
  const { handleError } = useErrorHandler();

  const register = async ({ email, password, nickName }: IRegField) => {
    setLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await set(ref(db, 'users/' + user.uid), {
        nickName: nickName,
        email: user.email,
        createdAt: serverTimestamp(),
      });

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
