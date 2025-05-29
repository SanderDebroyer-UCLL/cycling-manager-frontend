// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getStagePointsForAllStages,
  getStagePointsForStage,
} from '@/services/stage-points.service';
import { StagePoints, StagePointsPerCyclist } from '@/types/stage-points';

interface StagePointsState {
  stagePoints: StagePoints[];
  stagePointsPerCyclist: StagePointsPerCyclist[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialStagePointsState: StagePointsState = {
  stagePoints: [],
  stagePointsPerCyclist: [],
  status: 'idle',
};

export const fetchStagePointsForStage = createAsyncThunk(
  'stagePointss/fetchStagePoints',
  async (params: { competitionId: number; stageId: number }) => {
    const { competitionId, stageId } = params;
    const stagePoints = await getStagePointsForStage(competitionId, stageId);
    return stagePoints;
  },
);

export const fetchStagePointsForAllStages = createAsyncThunk(
  'stagePoints/fetchStagePointsForAllStages',
  async (params: { competitionId: number; userId: number }) => {
    const { competitionId, userId } = params;
    const stagePoints = await getStagePointsForAllStages(competitionId, userId);
    return stagePoints;
  },
);

const Slice = createSlice({
  name: 'user',
  initialState: initialStagePointsState,
  reducers: {
    resetStagePointsStatus(state) {
      state.status = 'idle';
    },
    updateStagePointsPerCyclist(
      state,
      action: PayloadAction<StagePointsPerCyclist[]>,
    ) {
      if (!action.payload) {
        return;
      }
      state.stagePointsPerCyclist = action.payload;
    },
    setStagePointsPerCyclist(
      state,
      action: PayloadAction<StagePointsPerCyclist[]>,
    ) {
      if (!action.payload) {
        return;
      }
      state.stagePointsPerCyclist = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStagePointsForStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchStagePointsForStage.fulfilled,
        (state, action: PayloadAction<StagePoints[]>) => {
          state.status = 'succeeded';
          state.stagePoints = action.payload;
        },
      )
      .addCase(fetchStagePointsForStage.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchStagePointsForAllStages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchStagePointsForAllStages.fulfilled,
        (state, action: PayloadAction<StagePointsPerCyclist[]>) => {
          state.status = 'succeeded';
          state.stagePointsPerCyclist = action.payload;
        },
      )
      .addCase(fetchStagePointsForAllStages.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const {
  resetStagePointsStatus,
  updateStagePointsPerCyclist,
  setStagePointsPerCyclist,
} = Slice.actions;

export default Slice.reducer;
