import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setUser, removeUser } from '@/store/userSlice';

interface UserProfile {
  id: string;
  email: string | null;
  token: string | null;
  nickName: string | null;
  createdAt?: number | null;
}

export const useAuthProfile = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const snapshot = await get(ref(db, 'users/' + user.uid));
          const dbData = snapshot.exists() ? snapshot.val() : {};

          const fullProfile: UserProfile = {
            id: user.uid,
            email: user.email,
            token,
            nickName: dbData.nickName ?? null,
            createdAt: dbData.createdAt ?? null,
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
  }, [dispatch]);

  return {
    loading,
    isAuth: !!profile?.email,
    profile,
  };
};
