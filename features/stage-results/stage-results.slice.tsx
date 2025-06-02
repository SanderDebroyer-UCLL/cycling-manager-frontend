// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getResultsByStageIdByType } from '@/services/results.service';
import { StageResult } from '@/types/race';
import { ResultType } from '@/const/resultType';

interface StageResultsState {
  etappeResult?: StageResult[];
  gcResult?: StageResult[];
  youthResult?: StageResult[];
  pointsResult?: StageResult[];
  mountainResult?: StageResult[];

  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialStageResultsState: StageResultsState = {
  etappeResult: [],
  status: 'idle',
};

export const fetchResultsByStageIdByType = createAsyncThunk(
  'stage-results/fetchResults',
  async (params: { stageId: number; resultType: ResultType }) => {
    const { stageId, resultType } = params;
    const results = await getResultsByStageIdByType(stageId, resultType);
    return results;
  },
);

const resultsSlice = createSlice({
  name: 'stage-results',
  initialState: initialStageResultsState,
  reducers: {
    resetStageResultsStatus(state) {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResultsByStageIdByType.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchResultsByStageIdByType.fulfilled,
        (state, action: PayloadAction<StageResult[]>) => {
          state.status = 'succeeded';

          if (action.payload.length === 0) {
            return;
          }

          const resultType = action.payload[0].scrapeResultType;

          switch (resultType) {
            case ResultType.STAGE:
              state.etappeResult = action.payload;
              break;
            case ResultType.GC:
              state.gcResult = action.payload;
              break;
            case ResultType.YOUNG:
              state.youthResult = action.payload;
              break;
            case ResultType.POINTS:
              state.pointsResult = action.payload;
              break;
            case ResultType.MOUNTAIN:
              state.mountainResult = action.payload;
              break;
          }
        },
      )
      .addCase(fetchResultsByStageIdByType.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetStageResultsStatus } = resultsSlice.actions;

export default resultsSlice.reducer;
