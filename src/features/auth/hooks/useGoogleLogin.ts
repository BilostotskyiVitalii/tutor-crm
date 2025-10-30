import { useNavigate } from 'react-router-dom';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from '@/app/firebase';
import { useGoogleLoginMutation } from '@/features/auth/api/authApi';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [googleLoginMutation, { isLoading, error }] = useGoogleLoginMutation();

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const user = await googleLoginMutation({ idToken }).unwrap();

      localStorage.setItem('token', user.token);

      navigate(navigationUrls.index);
    } catch (err: unknown) {
      handleError(err, 'Google Login Error');
    }
  };

  return { googleLogin, loading: isLoading, error };
};
