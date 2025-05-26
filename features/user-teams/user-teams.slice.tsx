import { getAllUserTeams } from '@/services/user-team.service';
import { Cyclist } from '@/types/cyclist';
import { UserTeam } from '@/types/user-team';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface UserTeamsState {
  data: UserTeam[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UserTeamsState = {
  data: [],
  status: 'idle',
};

export const fetchUserTeam = createAsyncThunk(
  'userTeam/fetchUserTeam',
  async () => {
    const data = await getAllUserTeams();
    return data;
  },
);

const userTeamsSlice = createSlice({
  name: 'userTeams',
  initialState,
  reducers: {
    updateUserTeamCyclists: (
      state,
      action: PayloadAction<{
        cyclistName: string;
        email: string;
        competitionId: string;
        maxCyclists?: number;
      }>,
    ) => {
      const { cyclistName, email, competitionId } = action.payload;
      const team = state.data.find(
        (team) =>
          team.user.email === email && team.competitionId === competitionId,
      );
      if (team) {
        // Prevent duplicates
        if (team.mainCyclists.length >= (action.payload.maxCyclists || 15)) {
          const cyclist: Cyclist = {
            name: cyclistName,
            id: '',
            team: [],
            age: 0,
            country: '',
          };
          team.reserveCyclists.push(cyclist);
          return;
        } else if (!team.mainCyclists.find((c) => c.name === cyclistName)) {
          const cyclist: Cyclist = {
            name: cyclistName,
            id: '',
            team: [],
            age: 0,
            country: '',
          };
          team.mainCyclists.push(cyclist);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTeam.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchUserTeam.fulfilled,
        (state, action: PayloadAction<UserTeam[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(fetchUserTeam.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { updateUserTeamCyclists } = userTeamsSlice.actions;
export default userTeamsSlice.reducer;
