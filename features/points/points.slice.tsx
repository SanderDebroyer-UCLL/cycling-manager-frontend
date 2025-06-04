// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getStagePointsForAllStages,
  getStagePointsForCompetitionId,
  getStagePointsForStage,
} from '@/services/stage-points.service';
import {
  MainReservePointsCyclist,
  Points,
  PointsPerCyclist,
  PointsReason,
} from '@/types/points';
import {
  getRacePointsForAllRaces,
  getRacePointsForCompetitionId,
  getRacePointsForRace,
} from '@/services/race-points.service';

interface PointsState {
  points: Points[];
  pointsPerCyclist: PointsPerCyclist[];
  pointsReason: PointsReason[];
  mainReservePointsCyclist: MainReservePointsCyclist | null;
  mainReservePointsCyclistPerEvent: MainReservePointsCyclist | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialPointsState: PointsState = {
  points: [],
  pointsPerCyclist: [],
  pointsReason: [],
  mainReservePointsCyclist: null,
  mainReservePointsCyclistPerEvent: null,
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

export const fetchRacePointsForRace = createAsyncThunk(
  'racePoints/fetchRacePointsForRaces',
  async (params: { competitionId: number; raceId: number }) => {
    const { competitionId, raceId } = params;
    const racePoints = await getRacePointsForRace(competitionId, raceId);
    return racePoints;
  },
);

export const fetchRacePointsForAllRaces = createAsyncThunk(
  'racePoints/fetchRacePointsForAllRaces',
  async (params: { competitionId: number; userId: number }) => {
    const { competitionId, userId } = params;
    const racePoints = await getRacePointsForAllRaces(competitionId, userId);
    return racePoints;
  },
);

export const fetchStagePointsForCompetitionId = createAsyncThunk(
  'stagePoints/fetchStagePointsForCompetitionId',
  async (competitionId: number) => {
    const stagePoints = await getStagePointsForCompetitionId(competitionId);
    return stagePoints;
  },
);

export const fetchRacePointsForCompetitionId = createAsyncThunk(
  'racePoints/fetchRacePointsForCompetitionId',
  async (competitionId: number) => {
    const racePoints = await getRacePointsForCompetitionId(competitionId);
    return racePoints;
  },
);

const Slice = createSlice({
  name: 'points',
  initialState: initialPointsState,
  reducers: {
    resetPointsStatus(state) {
      state.status = 'idle';
    },
    updateMainReservePointsCyclist(
      state,
      action: PayloadAction<MainReservePointsCyclist>,
    ) {
      if (!action.payload) {
        return;
      }
      state.mainReservePointsCyclist = action.payload;
    },
    setPointsPerCyclist(state, action: PayloadAction<PointsPerCyclist[]>) {
      if (!action.payload) {
        return;
      }
      state.pointsPerCyclist = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStagePointsForStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchStagePointsForStage.fulfilled,
        (state, action: PayloadAction<MainReservePointsCyclist>) => {
          state.status = 'succeeded';
          state.mainReservePointsCyclistPerEvent = action.payload;
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
        (state, action: PayloadAction<MainReservePointsCyclist>) => {
          state.status = 'succeeded';
          state.mainReservePointsCyclist = action.payload;
        },
      )
      .addCase(fetchStagePointsForAllStages.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchRacePointsForRace.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchRacePointsForRace.fulfilled,
        (state, action: PayloadAction<MainReservePointsCyclist>) => {
          state.status = 'succeeded';
          state.mainReservePointsCyclistPerEvent = action.payload;
        },
      )
      .addCase(fetchRacePointsForRace.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchRacePointsForAllRaces.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchRacePointsForAllRaces.fulfilled,
        (state, action: PayloadAction<MainReservePointsCyclist>) => {
          state.status = 'succeeded';
          state.mainReservePointsCyclist = action.payload;
        },
      )
      .addCase(fetchRacePointsForAllRaces.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchStagePointsForCompetitionId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchStagePointsForCompetitionId.fulfilled,
        (state, action: PayloadAction<Points[]>) => {
          state.status = 'succeeded';
          state.points = action.payload;
        },
      )
      .addCase(fetchStagePointsForCompetitionId.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchRacePointsForCompetitionId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchRacePointsForCompetitionId.fulfilled,
        (state, action: PayloadAction<Points[]>) => {
          state.status = 'succeeded';
          state.points = action.payload;
        },
      )
      .addCase(fetchRacePointsForCompetitionId.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const {
  resetPointsStatus,
  updateMainReservePointsCyclist,
  setPointsPerCyclist,
} = Slice.actions;

export default Slice.reducer;
