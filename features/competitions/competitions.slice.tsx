// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCompetitions } from '@/services/competition.service';
import { Competition } from '@/types/competition';

interface CompetitionsState {
  data: Competition[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialCompetitionsState: CompetitionsState = {
  data: [],
  status: 'idle',
};

export const fetchCompetitions = createAsyncThunk(
  'competitions/fetchCompetitions',
  async () => {
    const competitions = await getCompetitions();
    return competitions;
  },
);

const competitionsSlice = createSlice({
  name: 'competitions',
  initialState: initialCompetitionsState,
  reducers: {
    resetCompetitionsStatus(state) {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompetitions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCompetitions.fulfilled,
        (state, action: PayloadAction<Competition[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(fetchCompetitions.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetCompetitionsStatus } = competitionsSlice.actions;

export default competitionsSlice.reducer;
