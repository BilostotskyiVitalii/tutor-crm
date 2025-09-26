import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { UserProfile } from '@/features/user/userTypes';

interface UserState extends UserProfile {
  loading: boolean;
}

const initialState: UserState = {
  id: null,
  email: null,
  token: null,
  nickName: null,
  createdAt: null,
  avatar: null,
  loading: true,
  refreshToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.nickName = action.payload.nickName;
      state.createdAt = action.payload.createdAt ?? null;
      state.avatar = action.payload.avatar ?? null;
      state.loading = false;
      state.refreshToken = action.payload.refreshToken ?? null;
    },
    removeUser(state) {
      state.id = null;
      state.email = null;
      state.token = null;
      state.nickName = null;
      state.createdAt = null;
      state.avatar = null;
      state.loading = false;
      state.refreshToken = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, removeUser, setLoading } = userSlice.actions;

export default userSlice.reducer;
