// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser } from '@/services/auth.service';
import { Credentials } from '@/types/credentials';

// Define User type based on your API response
export interface User {
  id: string;
  name: string;
  // add more fields as needed
}

interface UserState {
  data: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UserState = {
  data: [],
  status: 'idle',
};

export const loginUserRequest = createAsyncThunk(
  'user/fetchUser',
  async (credentials: Credentials) => {
    const data = await loginUser(credentials);
    return data as User[];
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUserRequest.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(loginUserRequest.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default userSlice.reducer;
