import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
