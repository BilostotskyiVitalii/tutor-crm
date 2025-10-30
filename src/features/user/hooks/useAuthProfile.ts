import { useEffect } from 'react';

import { removeUser, setLoading, setUser } from '@/features/user/api/userSlice';
import { axs } from '@/shared/api/axiosInstance';
import { endpointsURL } from '@/shared/constants/endpointsUrl';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';

export const useAuthProfile = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.user);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (!token) {
      dispatch(removeUser());
      return;
    }

    const fetchProfile = async () => {
      dispatch(setLoading(true));

      try {
        const { data } = await axs.get(endpointsURL.apiProfile, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Оновлюємо Redux state користувача
        dispatch(
          setUser({
            id: data.id,
            email: data.email,
            token, // токен залишаємо той самий
            nickName: data.nickName,
            avatar: data.avatar ?? null,
            createdAt: data.createdAt,
            refreshToken: null,
          }),
        );
      } catch (err: unknown) {
        handleError(err, 'Auth Error');
        dispatch(removeUser());
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProfile();
  }, [token, dispatch, handleError]);
};
