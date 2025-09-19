import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { navigationUrls } from '@/constants/navigationUrls';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const { handleError } = useErrorHandler();

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
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
