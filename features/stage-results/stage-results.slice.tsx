// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getResultsByStageId } from '@/services/results.service';
import { StageResult } from '@/types/race';

interface StageResultsState {
  data: StageResult[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialStageResultsState: StageResultsState = {
  data: [],
  status: 'idle',
};

export const fetchStageResultsByStageId = createAsyncThunk(
  'stage-results/fetchResults',
  async (stageId: string) => {
    const results = await getResultsByStageId(stageId);
    return results;
  },
);

const resultsSlice = createSlice({
  name: 'user',
  initialState: initialStageResultsState,
  reducers: {
    resetStageResultsStatus(state) {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStageResultsByStageId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchStageResultsByStageId.fulfilled,
        (state, action: PayloadAction<StageResult[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(fetchStageResultsByStageId.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetStageResultsStatus } = resultsSlice.actions;

export default resultsSlice.reducer;
