import { useNavigate } from 'react-router-dom';

import { authApi } from '@/features/auth/api/authApi';
import { useAppDispatch } from '@/store/reduxHooks';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(authApi.util.resetApiState());
    navigate('/login');
  };

  return { logout };
};
