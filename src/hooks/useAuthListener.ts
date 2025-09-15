import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setUser } from '@/store/userSlice';

export const useAuthListener = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        dispatch(
          setUser({
            id: user.uid,
            email: user.email,
            token,
          }),
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { loading };
};
