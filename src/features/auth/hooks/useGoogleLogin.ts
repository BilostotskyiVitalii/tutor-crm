import { useNavigate } from 'react-router-dom';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from '@/app/firebase';
import { useGoogleLoginMutation } from '@/features/auth/api/authApi';
import { setUser } from '@/features/auth/api/authSlice';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useAppDispatch } from '@/store/reduxHooks';

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [googleLoginMutation, { isLoading, error }] = useGoogleLoginMutation();
  const dispatch = useAppDispatch();

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await googleLoginMutation({ idToken }).unwrap();

      dispatch(
        setUser({
          id: response.id,
          email: response.email,
          token: response.token,
          nickName: response.nickName,
          avatar: response.avatar,
          createdAt: Date.now(),
          refreshToken: response.refreshToken,
        }),
      );

      navigate(navigationUrls.index);
    } catch (err: unknown) {
      handleError(err, 'Google Login Error');
    }
  };

  return { googleLogin, loading: isLoading, error };
};
