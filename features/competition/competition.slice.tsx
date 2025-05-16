// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Competition, CreateCompetitionDetails } from '@/types/competition';
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
  }
);

export const fetchCompetitionById = createAsyncThunk(
  'competition/fetchCompetition',
  async (competitionId: string) => {
    const competition = await getCompetition(competitionId);
    return competition;
  }
);

const competitionSlice = createSlice({
  name: 'user',
  initialState: initialCompetitionState,
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
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
        }
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
        }
      )
      .addCase(fetchCompetitionById.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default competitionSlice.reducer;
