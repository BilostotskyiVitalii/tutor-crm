import type { IUserProfile } from '@/types/userTypes';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: IUserProfile = {
  id: null,
  email: null,
  token: null,
  nickName: null,
  createdAt: null,
  avatar: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUserProfile>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.nickName = action.payload.nickName;
      state.createdAt = action.payload.createdAt ?? null;
      state.avatar = action.payload.avatar ?? null;
    },
    removeUser(state) {
      state.id = null;
      state.email = null;
      state.token = null;
      state.nickName = null;
      state.createdAt = null;
      state.avatar = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
