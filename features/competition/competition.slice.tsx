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
  scrapeAllCompetitionResults,
  scrapeCompetitionStages,
  updateCompetitionStatusPut,
} from '@/services/competition.service';

interface CompetitionState {
  competition: Competition | null;
  competitionDTO: CompetitionDTO | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateCompetitionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchCompetitionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialCompetitionState: CompetitionState = {
  competition: null,
  competitionDTO: null,
  status: 'idle',
  updateCompetitionStatus: 'idle',
  fetchCompetitionStatus: 'idle',
  error: null,
};

export const createCompetitionRequest = createAsyncThunk(
  'competition/createCompetition',
  async (competitionData: CreateCompetitionDetails) => {
    const competition = await createCompetition(competitionData);
    return competition;
  },
);

export const updateCompetitionStatusRequest = createAsyncThunk(
  'competition/updateCompetition',
  async (params: {
    competitionId: number;
    competitionStatus: CompetitionStatus;
  }) => {
    const { competitionId, competitionStatus } = params;
    // Assuming there's an updateCompetition service function
    const data = await updateCompetitionStatusPut(
      params.competitionId,
      params.competitionStatus,
    );
    return data;
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

export const fetchCompetitionStages = createAsyncThunk(
  'competition/fetchCompetitionStages',
  async (competitionId: number) => {
    const competition = await scrapeCompetitionStages(competitionId);
    return competition;
  },
);

export const fetchScrapeAllCompetitionResults = createAsyncThunk(
  'competition/fetchScrapeAllCompetitionResults',
  async () => {
    const data = await scrapeAllCompetitionResults();
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
    resetUpdateCompetitionStatus(state) {
      state.updateCompetitionStatus = 'idle';
    },
    resetCompetitonData(state) {
      state.competition = null;
      state.competitionDTO = null;
      state.status = 'idle';
      state.error = null;
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
      .addCase(createCompetitionRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.error.message || 'Mislukt om competitie aan te maken';
      })
      .addCase(fetchCompetitionById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCompetitionById.fulfilled,
        (state, action: PayloadAction<CompetitionDTO>) => {
          state.status = 'succeeded';

          // Clone and sort races by startDate (assuming ISO string)
          const sortedRaces = [...action.payload.races].sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          );

          // Save modified DTO with sorted races
          state.competitionDTO = {
            ...action.payload,
            races: sortedRaces,
          };
        },
      )
      .addCase(fetchCompetitionById.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchCompetitionResultsUpdate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompetitionResultsUpdate.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(fetchCompetitionResultsUpdate.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchCompetitionStages.pending, (state) => {
        state.fetchCompetitionStatus = 'loading';
      })
      .addCase(
        fetchCompetitionStages.fulfilled,
        (state, action: PayloadAction<CompetitionDTO>) => {
          state.fetchCompetitionStatus = 'succeeded';

          // Clone and sort races by startDate (assuming ISO string)
          const sortedRaces = [...action.payload.races].sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          );

          // Save modified DTO with sorted races
          state.competitionDTO = {
            ...action.payload,
            races: sortedRaces,
          };
        },
      )
      .addCase(fetchCompetitionStages.rejected, (state) => {
        state.fetchCompetitionStatus = 'failed';
      })
      .addCase(updateCompetitionStatusRequest.pending, (state) => {
        state.updateCompetitionStatus = 'loading';
      })
      .addCase(updateCompetitionStatusRequest.fulfilled, (state) => {
        state.updateCompetitionStatus = 'succeeded';
      })
      .addCase(updateCompetitionStatusRequest.rejected, (state) => {
        state.updateCompetitionStatus = 'failed';
        state.error =
          'Mislukt om competitie status bij te werken. Probeer het later opnieuw.';
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
  resetCompetitonData,
  resetUpdateCompetitionStatus,
} = competitionSlice.actions;
export default competitionSlice.reducer;
