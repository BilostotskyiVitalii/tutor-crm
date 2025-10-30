import { configureStore } from '@reduxjs/toolkit';

import { authApi } from '@/features/auth/api/authApi';
import { dashboardApi } from '@/features/dashboard/api/dashboardApi';
import { groupsApi } from '@/features/groups/api/groupsApi';
import { lessonsApi } from '@/features/lessons/api/lessonsApi';
import { studentsApi } from '@/features/students/api/studentsApi';
import themeReducer from '@/features/theme/themeSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
    [groupsApi.reducerPath]: groupsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      studentsApi.middleware,
      lessonsApi.middleware,
      groupsApi.middleware,
      dashboardApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
