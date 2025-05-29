// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Competition,
  CompetitionPick,
  CompetitionStatus,
  CreateCompetitionDetails,
} from '@/types/competition';
import {
  createCompetition,
  getCompetition,
} from '@/services/competition.service';

interface CompetitionState {
  data: Competition | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialCompetitionState: CompetitionState = {
  data: null,
  status: 'idle',
};

export const createCompetitionRequest = createAsyncThunk(
  'competition/createCompetition',
  async (competitionData: CreateCompetitionDetails) => {
    const competition = await createCompetition(competitionData);
    return competition;
  },
);

export const fetchCompetitionById = createAsyncThunk(
  'competition/fetchCompetition',
  async (competitionId: number) => {
    const competition = await getCompetition(competitionId);
    return competition;
  },
);

const competitionSlice = createSlice({
  name: 'user',
  initialState: initialCompetitionState,
  reducers: {
    resetCompetitionStatus(state) {
      state.status = 'idle';
    },
    updateCompetition(
      state,
      action: PayloadAction<{
        competitionPicks: CompetitionPick[];
        competitionId: number;
      }>,
    ) {
      const { competitionPicks } = action.payload;
      if (!state.data) {
        return;
      }
      state.data.competitionPicks = competitionPicks;
    },
    updateCompetitionStatus(state, action: PayloadAction<CompetitionStatus>) {
      const competitionStatus = action.payload;
      if (!state.data) {
        return;
      }
      state.data.competitionStatus = competitionStatus;
    },
    updateCompetitionPick(state, action: PayloadAction<number>) {
      const currentPick = action.payload;
      if (!state.data) {
        return;
      }
      state.data.currentPick = currentPick;
    },
    updateCyclistCount(state, action: PayloadAction<number>) {
      const maxMainCyclists = action.payload;
      if (!state.data) {
        return;
      }
      state.data.maxMainCyclists = maxMainCyclists;
    },
    updateReserveCyclistCount(state, action: PayloadAction<number>) {
      const maxReserveCyclists = action.payload;
      if (!state.data) {
        return;
      }
      state.data.maxReserveCyclists = maxReserveCyclists;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCompetitionRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        createCompetitionRequest.fulfilled,
        (state, action: PayloadAction<Competition>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(createCompetitionRequest.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchCompetitionById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCompetitionById.fulfilled,
        (state, action: PayloadAction<Competition>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(fetchCompetitionById.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const {
  resetCompetitionStatus,
  updateCompetition,
  updateCompetitionStatus,
  updateCompetitionPick,
  updateCyclistCount,
  updateReserveCyclistCount,
} = competitionSlice.actions;
export default competitionSlice.reducer;
