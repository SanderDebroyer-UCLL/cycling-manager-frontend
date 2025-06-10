// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  createStagePoints,
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
  createRacePoints,
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
  createPointsStatus?: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialPointsState: PointsState = {
  points: [],
  pointsPerCyclist: [],
  pointsReason: [],
  mainReservePointsCyclist: null,
  mainReservePointsCyclistPerEvent: null,
  status: 'idle',
  error: null,
};

type PointType = 'Stage' | 'Race';

interface CreatePointsParams {
  stageId?: number;
  raceId?: number;
  competitionId: number;
  value: number;
  reason: string;
  type: PointType;
}

export const postCreatePoints = createAsyncThunk(
  'points/createPoints',
  async (params: CreatePointsParams) => {
    const { stageId, raceId, competitionId, value, reason, type } = params;

    if (type === 'Stage') {
      if (!stageId) throw new Error('stageId is required for stage points');
      return await createStagePoints({ stageId, competitionId, value, reason });
    } else if (type === 'Race') {
      if (!raceId) throw new Error('raceId is required for race points');
      return await createRacePoints({ raceId, competitionId, value, reason });
    } else {
      throw new Error('Invalid point type');
    }
  },
);

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
    resetCreatePointsStatus(state) {
      state.createPointsStatus = 'idle';
    },
    resetPointsData(state) {
      state.points = [];
      state.pointsPerCyclist = [];
      state.pointsReason = [];
      state.mainReservePointsCyclist = null;
      state.mainReservePointsCyclistPerEvent = null;
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
      })
      .addCase(postCreatePoints.pending, (state) => {
        state.createPointsStatus = 'loading';
      })
      .addCase(
        postCreatePoints.fulfilled,
        (state, action: PayloadAction<Points>) => {
          state.createPointsStatus = 'succeeded';
          state.points.push(action.payload);
        },
      )
      .addCase(postCreatePoints.rejected, (state, action) => {
        state.createPointsStatus = 'failed';
        state.error = action.error.message || 'Mislukt om punten aan te maken';
      });
  },
});

export const {
  resetPointsStatus,
  updateMainReservePointsCyclist,
  setPointsPerCyclist,
  resetPointsData,
  resetCreatePointsStatus,
} = Slice.actions;

export default Slice.reducer;
