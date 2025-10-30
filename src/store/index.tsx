import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { authApi } from '@/features/auth/api/authApi';
import authReducer from '@/features/auth/api/authSlice';
import { dashboardApi } from '@/features/dashboard/api/dashboardApi';
import { groupsApi } from '@/features/groups/api/groupsApi';
import { lessonsApi } from '@/features/lessons/api/lessonsApi';
import { studentsApi } from '@/features/students/api/studentsApi';
import themeReducer from '@/features/theme/themeSlice';

const themePersistConfig = {
  key: 'theme',
  storage,
};

const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'email', 'id'],
};

export const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authReducer,
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    theme: persistedThemeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
    [groupsApi.reducerPath]: groupsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      studentsApi.middleware,
      lessonsApi.middleware,
      groupsApi.middleware,
      dashboardApi.middleware,
    ),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
