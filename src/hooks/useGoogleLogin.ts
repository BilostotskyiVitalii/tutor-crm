import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { navigationUrls } from '@/constants/navigationUrls';

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate(navigationUrls.index);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Ошибка при логине через Google:', err);
      } else {
        setError('Неизвестная ошибка при логине через Google');
        console.error('Неизвестная ошибка при логине через Google:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading, error };
};
