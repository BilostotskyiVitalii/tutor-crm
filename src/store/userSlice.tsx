import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  email: string | null;
  token: string | null;
  nickName: string | null;
  createdAt?: number | null;
}

const initialState: UserState = {
  id: null,
  email: null,
  token: null,
  nickName: null,
  createdAt: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.nickName = action.payload.nickName;
      state.createdAt = action.payload.createdAt ?? null;
    },
    removeUser(state) {
      state.id = null;
      state.email = null;
      state.token = null;
      state.nickName = null;
      state.createdAt = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
