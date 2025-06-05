import {
  getAllUserTeams,
  getCyclistsWithDNS,
  updateUserTeamMainCyclists,
} from '@/services/user-team.service';
import { CyclistDTO } from '@/types/cyclist';
import {
  CyclistAssignmentDTO,
  CyclistRole,
  UserTeamDTO,
} from '@/types/user-team';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface UserTeamsState {
  data: UserTeamDTO[];
  cyclistsWithDNS: CyclistDTO[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserTeamsState = {
  data: [],
  cyclistsWithDNS: [],
  status: 'idle',
  updateStatus: 'idle',
  error: null,
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

export const fetchCyclistsWithDNS = createAsyncThunk(
  'userTeam/fetchCyclistsWithDNS',
  async (competitionId: number) => {
    const data = await getCyclistsWithDNS(competitionId);
    return data;
  },
);

const userTeamsSlice = createSlice({
  name: 'userTeam',
  initialState,
  reducers: {
    updateUserTeamCyclists: (
      state,
      action: PayloadAction<{
        cyclistName: string;
        cyclistId: number;
        email: string;
        competitionId: number;
        maxCyclists?: number;
        pointsScored?: number;
      }>,
    ) => {
      const { cyclistName, cyclistId, email, competitionId, maxCyclists } =
        action.payload;
      const team = state.data.find(
        (team) =>
          team.user.email === email && team.competitionId === competitionId,
      );
      if (team) {
        // Prevent duplicates
        if (
          team.cyclistAssignments.filter(
            (cyclistAssignments) =>
              cyclistAssignments.role === CyclistRole.MAIN,
          ).length >= (maxCyclists || 15)
        ) {
          const cyclistAssignment: CyclistAssignmentDTO = {
            id: 0,
            cyclist: {
              name: cyclistName,
              id: cyclistId,
              team: {
                id: 0,
                name: '',
                ranking: 0,
                teamUrl: '',
              },
              age: 0,
              country: '',
              ranking: 0,
              cyclistUrl: '',
              upcomingRaces: [],
            },
            role: CyclistRole.RESERVE,
            fromStage: 0,
            toStage: 0,
          };
          team.cyclistAssignments.push(cyclistAssignment);
        } else if (
          !team.cyclistAssignments.some(
            (assignment) => assignment.cyclist.name === cyclistName,
          )
        ) {
          const cyclistAssignment: CyclistAssignmentDTO = {
            id: 0,
            cyclist: {
              name: cyclistName,
              id: cyclistId,
              team: {
                id: 0,
                name: '',
                ranking: 0,
                teamUrl: '',
              },
              age: 0,
              country: '',
              ranking: 0,
              cyclistUrl: '',
              upcomingRaces: [],
            },
            role: CyclistRole.MAIN,
            fromStage: 0,
            toStage: 0,
          };
          team.cyclistAssignments.push(cyclistAssignment);
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
        team.cyclistAssignments.filter(
          (cyclistAssignments) => cyclistAssignments.role === CyclistRole.MAIN,
        );
      }
    },
    setUserTeams: (state, action: PayloadAction<UserTeamDTO[]>) => {
      if (!action.payload) {
        return;
      }
      state.data = action.payload;
    },
    resetUserTeamsStatus: (state) => {
      state.status = 'idle';
    },
    resetUserTeamsUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTeam.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchUserTeam.fulfilled,
        (state, action: PayloadAction<UserTeamDTO[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(fetchUserTeam.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchCyclistsWithDNS.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCyclistsWithDNS.fulfilled,
        (state, action: PayloadAction<CyclistDTO[]>) => {
          state.status = 'succeeded';
          state.cyclistsWithDNS = action.payload;
        },
      )
      .addCase(fetchCyclistsWithDNS.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(postUpdateUserTeamMainCyclists.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(postUpdateUserTeamMainCyclists.fulfilled, (state) => {
        state.updateStatus = 'succeeded';
      })
      .addCase(postUpdateUserTeamMainCyclists.rejected, (state) => {
        state.updateStatus = 'failed';
      });
  },
});

export const {
  updateUserTeamCyclists,
  removeCyclistFromUserTeamCylists,
  setUserTeams,
  resetUserTeamsStatus,
  resetUserTeamsUpdateStatus,
} = userTeamsSlice.actions;
export default userTeamsSlice.reducer;
