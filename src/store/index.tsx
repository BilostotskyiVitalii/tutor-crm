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

import { dashboardApi } from '@/features/dashboard/api/dashboardApi';
import { groupsApi } from '@/features/groups/api/groupsApi';
import { lessonsApi } from '@/features/lessons/api/lessonsApi';
import { studentsApi } from '@/features/students/api/studentsApi';
import themeReducer from '@/features/theme/themeSlice';
import userReducer from '@/features/user/api/userSlice';

const userPersistConfig = {
  key: 'user',
  storage,
};

const themePersistConfig = {
  key: 'theme',
  storage,
};

const persistedReducer = persistReducer(userPersistConfig, userReducer);
const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    theme: persistedThemeReducer,
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
      studentsApi.middleware,
      lessonsApi.middleware,
      groupsApi.middleware,
      dashboardApi.middleware,
    ),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
