import { useEffect } from 'react';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

import { useAppDispatch } from '@/hooks/reduxHooks';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { groupsApi } from '@/store/groupsApi';
import { lessonsApi } from '@/store/lessonsApi';
import { studentsApi } from '@/store/studentsApi';
import { removeUser, setLoading, setUser } from '@/store/userSlice';

export const useAuthProfile = () => {
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const auth = getAuth();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    dispatch(setLoading(true));

    function resetAPIs() {
      dispatch(studentsApi.util.resetApiState());
      dispatch(lessonsApi.util.resetApiState());
      dispatch(groupsApi.util.resetApiState());
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      resetAPIs();

      if (user) {
        try {
          const token = await user.getIdToken();
          const refreshToken = user.refreshToken;

          const userRef = doc(db, 'users', user.uid);
          const snapshot = await getDoc(userRef);
          const dbData = snapshot.exists() ? snapshot.data() : {};

          if (!snapshot.exists() && user.displayName) {
            await setDoc(userRef, {
              email: user.email,
              nickName: user.displayName,
              createdAt: serverTimestamp(),
              avatar: user.photoURL,
            });
          }

          const createdAtMillis =
            dbData.createdAt instanceof Timestamp
              ? dbData.createdAt.toMillis()
              : (dbData.createdAt ?? Date.now());

          dispatch(
            setUser({
              id: user.uid,
              email: user.email,
              token,
              refreshToken,
              nickName: dbData.nickName ?? user.displayName ?? null,
              createdAt: createdAtMillis,
              avatar: dbData.avatar ?? user.photoURL ?? null,
            }),
          );
        } catch (err) {
          handleError(err, 'Auth Error');
          dispatch(removeUser());
          resetAPIs();
        }
      } else {
        dispatch(removeUser());
        resetAPIs();
      }
    });

    return () => unsubscribe();
  }, [dispatch, db, auth, handleError]);
};
