import {
  getAllUserTeams,
  updateUserTeamMainCyclists,
} from '@/services/user-team.service';
import { Cyclist } from '@/types/cyclist';
import { UserTeam } from '@/types/user-team';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';

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

export const postUpdateUserTeamMainCyclists = createAsyncThunk(
  'userTeam/updateUserTeamMainCyclists',
  async (params: {
    mainCyclistIds: number[];
    reserveCyclistIds: number[];
    userTeamId: number;
  }) => {
    const data = await updateUserTeamMainCyclists(
      params.mainCyclistIds,
      params.reserveCyclistIds,
      params.userTeamId,
    );
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
        competitionId: number;
        maxCyclists?: number;
        pointsScored?: number;
      }>,
    ) => {
      const { cyclistName, email, competitionId, maxCyclists, pointsScored } =
        action.payload;
      const team = state.data.find(
        (team) =>
          team.user.email === email && team.competitionId === competitionId,
      );
      if (team) {
        // Prevent duplicates
        if (team.mainCyclists.length >= (maxCyclists || 15)) {
          const cyclist: Cyclist = {
            name: cyclistName,
            id: 0,
            team: [],
            age: 0,
            country: '',
            pointsScored,
          };
          team.reserveCyclists.push(cyclist);
          return;
        } else if (!team.mainCyclists.find((c) => c.name === cyclistName)) {
          const cyclist: Cyclist = {
            name: cyclistName,
            id: 0,
            team: [],
            age: 0,
            country: '',
          };
          team.mainCyclists.push(cyclist);
        }
      }
    },
    removeCyclistFromUserTeamCylists: (
      state,
      action: PayloadAction<{
        cyclistName: string;
        email: string;
        competitionId: number;
      }>,
    ) => {
      const { cyclistName, email, competitionId } = action.payload;
      const team = state.data.find(
        (team) =>
          team.user.email === email && team.competitionId === competitionId,
      );
      if (team) {
        team.reserveCyclists = team.reserveCyclists.filter(
          (cyclist) => cyclist.name !== cyclistName,
        );
      }
    },
    setUserTeams: (state, action: PayloadAction<UserTeam[]>) => {
      if (!action.payload) {
        return;
      }
      state.data = action.payload;
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

export const {
  updateUserTeamCyclists,
  removeCyclistFromUserTeamCylists,
  setUserTeams,
} = userTeamsSlice.actions;
export default userTeamsSlice.reducer;
