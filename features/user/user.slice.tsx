import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '@/services/auth.service';
import { Credentials } from '@/types/credentials';
import { JwtRes, RegisterUserDetails, User, UserDTO } from '@/types/user';
import { getLoggedInUser } from '@/services/user.service';

interface UserState {
  userDTO: UserDTO | null;
  jwtRes: JwtRes | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'not-authenticated';
  error: string | null;
}

const initialUserState: UserState = {
  userDTO: null,
  jwtRes: null,
  status: 'idle',
  error: null,
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
  async (userInfo: RegisterUserDetails) => {
    const user = await registerUser(userInfo);
    return user;
  },
);

export const requestLoggedInUser = createAsyncThunk(
  'user/getLoggedInUser',
  async () => {
    const user = await getLoggedInUser();
    return user;
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    resetUserStatus(state) {
      state.status = 'idle';
    },
    setUser(state, action) {
      if (action.payload === null) {
        state.userDTO = null;
        return;
      }

      if (state.userDTO === null) {
        return;
      }
      state.userDTO.email = action.payload.email;
      state.userDTO.jwtToken = action.payload.jwtToken;
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
        (state, action: PayloadAction<JwtRes>) => {
          state.status = 'succeeded';
          state.jwtRes = action.payload;
          state.error = null;
        },
      )
      .addCase(loginUserRequest.rejected, (state, action) => {
        state.status = 'failed';
        // save the error message in state.error
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(registerUserRequest.pending, (state) => {
        state.status = 'loading';
        state.error = null; // clear previous errors on new request
      })
      .addCase(registerUserRequest.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUserRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to register';
      })
      .addCase(requestLoggedInUser.pending, (state) => {
        state.status = 'loading';
        state.error = null; // clear previous errors on new request
      })
      .addCase(
        requestLoggedInUser.fulfilled,
        (state, action: PayloadAction<UserDTO>) => {
          state.status = 'succeeded';
          state.userDTO = action.payload;
          state.error = null;
        },
      )
      .addCase(requestLoggedInUser.rejected, (state) => {
        state.status = 'not-authenticated';
        state.error = null;
      });
  },
});

export const { resetUserStatus } = userSlice.actions;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
