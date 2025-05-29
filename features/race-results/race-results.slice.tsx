// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RaceResult } from '@/types/race-result';
import { getRaceResultsByRaceId } from '@/services/results.service';

interface RaceResultsState {
  data: RaceResult[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialRaceResultsState: RaceResultsState = {
  data: [],
  status: 'idle',
};

export const fetchRaceResultsByRaceId = createAsyncThunk(
  'race-results/fetchRaceResults',
  async (raceId: number) => {
    const results = await getRaceResultsByRaceId(raceId);
    return results;
  },
);

const resultsSlice = createSlice({
  name: 'user',
  initialState: initialRaceResultsState,
  reducers: {
    resetRaceResultsStatus(state) {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRaceResultsByRaceId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchRaceResultsByRaceId.fulfilled,
        (state, action: PayloadAction<RaceResult[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(fetchRaceResultsByRaceId.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetRaceResultsStatus } = resultsSlice.actions;

export default resultsSlice.reducer;
