import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getDatabase, ref, get, set, serverTimestamp } from 'firebase/database';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setUser, removeUser } from '@/store/userSlice';
import type { IUserProfile } from '@/types/userTypes';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { studentsApi } from '@/store/studentsApi';

export const useAuthProfile = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const db = getDatabase();
  const auth = getAuth();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const userRef = ref(db, 'users/' + user.uid);
          const snapshot = await get(userRef);
          const dbData = snapshot.exists() ? snapshot.val() : {};

          if (!snapshot.exists() && user.displayName) {
            await set(userRef, {
              email: user.email,
              nickName: user.displayName,
              createdAt: serverTimestamp(),
              avatar: user.photoURL,
            });
          }

          const fullProfile: IUserProfile = {
            id: user.uid,
            email: user.email,
            token,
            nickName: dbData.nickName ?? user.displayName ?? null,
            createdAt: dbData.createdAt ?? serverTimestamp(),
            avatar: dbData.avatar ?? user.photoURL ?? null,
          };

          setProfile(fullProfile);
          dispatch(setUser(fullProfile));
        } catch (err) {
          handleError(err, 'Auth Error');
          setProfile(null);
        }
      } else {
        setProfile(null);
        dispatch(removeUser());
        dispatch(studentsApi.util.resetApiState());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, db, auth, handleError]);

  return {
    loading,
    isAuth: !!profile?.email,
    profile,
  };
};
