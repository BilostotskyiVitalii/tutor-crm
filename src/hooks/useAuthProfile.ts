import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get, set, serverTimestamp } from 'firebase/database';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setUser, removeUser, setLoading } from '@/store/userSlice';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export const useAuthProfile = () => {
  const dispatch = useAppDispatch();
  const db = getDatabase();
  const auth = getAuth();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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

          dispatch(
            setUser({
              id: user.uid,
              email: user.email,
              token,
              nickName: dbData.nickName ?? user.displayName ?? null,
              createdAt: dbData.createdAt ?? serverTimestamp(),
              avatar: dbData.avatar ?? user.photoURL ?? null,
            }),
          );
        } catch (err) {
          handleError(err, 'Auth Error');
          dispatch(removeUser());
        }
      } else {
        dispatch(removeUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch, db, auth, handleError]);
};
