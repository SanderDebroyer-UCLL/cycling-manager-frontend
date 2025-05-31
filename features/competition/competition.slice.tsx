// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Competition,
  CompetitionDTO,
  CompetitionPick,
  CompetitionStatus,
  CreateCompetitionDetails,
} from '@/types/competition';
import {
  createCompetition,
  getCompetition,
  getCompetitionResultsUpdate,
} from '@/services/competition.service';

interface CompetitionState {
  competition: Competition | null;
  competitionDTO: CompetitionDTO | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialCompetitionState: CompetitionState = {
  competition: null,
  competitionDTO: null,
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

export const fetchCompetitionResultsUpdate = createAsyncThunk(
  'competition/fetchCompetitionResultsUpdate',
  async (competitionId: number) => {
    const data = await getCompetitionResultsUpdate(competitionId);
    return data;
  },
);

const competitionSlice = createSlice({
  name: 'competition',
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
      if (!state.competitionDTO) {
        return;
      }
      state.competitionDTO.competitionPicks = competitionPicks;
    },
    updateCompetitionStatus(state, action: PayloadAction<CompetitionStatus>) {
      const competitionStatus = action.payload;
      if (!state.competitionDTO) {
        return;
      }
      state.competitionDTO.competitionStatus = competitionStatus;
    },
    updateCompetitionPick(state, action: PayloadAction<number>) {
      const currentPick = action.payload;
      if (!state.competitionDTO) {
        return;
      }
      state.competitionDTO.currentPick = currentPick;
    },
    updateCyclistCount(state, action: PayloadAction<number>) {
      const maxMainCyclists = action.payload;
      if (!state.competitionDTO) {
        return;
      }
      state.competitionDTO.maxMainCyclists = maxMainCyclists;
    },
    updateReserveCyclistCount(state, action: PayloadAction<number>) {
      const maxReserveCyclists = action.payload;
      if (!state.competitionDTO) {
        return;
      }
      state.competitionDTO.maxReserveCyclists = maxReserveCyclists;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCompetitionRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        createCompetitionRequest.fulfilled,
        (state, action: PayloadAction<CompetitionDTO>) => {
          state.status = 'succeeded';
          state.competitionDTO = action.payload;
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
        (state, action: PayloadAction<CompetitionDTO>) => {
          state.status = 'succeeded';
          state.competitionDTO = action.payload;
        },
      )
      .addCase(fetchCompetitionById.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchCompetitionResultsUpdate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCompetitionResultsUpdate.fulfilled,
        (state, action: PayloadAction<Competition>) => {
          state.status = 'succeeded';
        },
      )
      .addCase(fetchCompetitionResultsUpdate.rejected, (state) => {
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
