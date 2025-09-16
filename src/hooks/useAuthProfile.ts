import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getDatabase, ref, get, set, serverTimestamp } from 'firebase/database';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setUser, removeUser } from '@/store/userSlice';
import type { IUserProfile } from '@/types/userTypes';

export const useAuthProfile = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const db = getDatabase();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const userRef = ref(db, 'users/' + user.uid);
          const snapshot = await get(userRef);
          const dbData = snapshot.exists() ? snapshot.val() : {};

          // Если нет nickName в БД, используем displayName из Google
          const nickName = dbData.nickName ?? user.displayName ?? null;
          const createdAt = dbData.createdAt ?? serverTimestamp();

          // Если пользователя нет в БД, создаем запись
          if (!snapshot.exists()) {
            await set(userRef, {
              nickName,
              email: user.email,
              createdAt,
            });
          }

          const fullProfile: IUserProfile = {
            id: user.uid,
            email: user.email,
            token,
            nickName,
            createdAt,
          };

          setProfile(fullProfile);
          dispatch(setUser(fullProfile));
        } catch (err) {
          console.error('Ошибка при получении профиля:', err);
          setProfile(null);
        }
      } else {
        setProfile(null);
        dispatch(removeUser());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, db, auth]);

  return {
    loading,
    isAuth: !!profile?.email,
    profile,
  };
};
