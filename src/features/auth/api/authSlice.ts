import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { AuthState } from '@/features/auth/api/authApi';

const initialState: AuthState = {
  id: null,
  email: null,
  token: null,
  nickName: null,
  avatar: null,
  createdAt: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      return { ...state, ...action.payload };
    },
    removeUser: () => initialState,
  },
});

export const { setUser, removeUser } = authSlice.actions;
export default authSlice.reducer;
