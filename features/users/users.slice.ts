import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserDTO } from '@/types/user';
import { getUsers } from '@/services/user.service';

interface UsersState {
  data: UserDTO[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
const initialUsersState: UsersState = {
  data: [],
  status: 'idle',
};

export const fetchUsers = createAsyncThunk(
  'user/fetchUsersRequest',
  async () => {
    const users = await getUsers();
    return users;
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: initialUsersState,
  reducers: {
    resetUsersStatus(state) {
      state.status = 'idle';
    },
    setUsers(state, action: PayloadAction<UserDTO[]>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UserDTO[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetUsersStatus } = usersSlice.actions;
export default usersSlice.reducer;
