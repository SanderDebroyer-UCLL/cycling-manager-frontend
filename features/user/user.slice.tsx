import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '@/services/auth.service';
import { Credentials } from '@/types/credentials';
import { RegisterUserDetails, User } from '@/types/user';

interface UserState {
  data: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialUserState: UserState = {
  data: null,
  status: 'idle',
  error: null,
};

export const loginUserRequest = createAsyncThunk(
  'user/loginUser',
  async (credentials: Credentials) => {
    const user = await loginUser(credentials);
    return user;
  }
);

export const registerUserRequest = createAsyncThunk(
  'user/registerUser',
  async (userInfo: RegisterUserDetails) => {
    const user = await registerUser(userInfo);
    return user;
  }
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
        state.error = null; // clear previous errors on new request
      })
      .addCase(
        loginUserRequest.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = 'succeeded';
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(loginUserRequest.rejected, (state, action) => {
        state.status = 'failed';
        // save the error message in state.error
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(registerUserRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        registerUserRequest.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        }
      )
      .addCase(registerUserRequest.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetStatus } = userSlice.actions;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
