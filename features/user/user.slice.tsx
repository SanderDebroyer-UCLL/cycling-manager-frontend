import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '@/services/auth.service';
import { Credentials } from '@/types/credentials';
import { User } from '@/types/user';

interface UserState {
  data: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialUserState: UserState = {
  data: null,
  status: 'idle',
};

export const loginUserRequest = createAsyncThunk(
  'user/loginUser',
  async (credentials: Credentials) => {
    const user = await loginUser(credentials);
    return user;
  },
);

export const registerUserRequest = createAsyncThunk(
  'user/registerUser',
  async (userInfo: User) => {
    const user = await registerUser(userInfo);
    return user;
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
    },
    setUser(state, action) {
      if (action.payload === null) {
        state.data = null;
        return;
      }

      
      if (state.data === null) {
        state.data = {
          email: '',
          jwtToken: '',
          name: '',
          password: '',
        };
      }
      state.data.email = action.payload.email;
      state.data.jwtToken = action.payload.jwtToken;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        loginUserRequest.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )

      .addCase(loginUserRequest.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(registerUserRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        registerUserRequest.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(registerUserRequest.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetStatus } = userSlice.actions;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
