import { useNavigate } from 'react-router-dom';

import { authApi } from '@/features/auth/api/authApi';
import { dashboardApi } from '@/features/dashboard/api/dashboardApi';
import { groupsApi } from '@/features/groups/api/groupsApi';
import { lessonsApi } from '@/features/lessons/api/lessonsApi';
import { studentsApi } from '@/features/students/api/studentsApi';
import { useAppDispatch } from '@/store/reduxHooks';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(authApi.util.resetApiState());
    dispatch(studentsApi.util.resetApiState());
    dispatch(lessonsApi.util.resetApiState());
    dispatch(groupsApi.util.resetApiState());
    dispatch(dashboardApi.util.resetApiState());
    navigate('/login');
  };

  return { logout };
};
