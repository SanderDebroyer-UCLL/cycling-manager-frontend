import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getAllRaces,
  reloadRaceData,
  scrapeRaces,
} from '@/services/race.service';
import { RaceDTO } from '@/types/race';

// Define Race type based on your API response
interface RacesState {
  data: RaceDTO[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: RacesState = {
  data: [],
  status: 'idle',
};

export const fetchRace = createAsyncThunk('race/fetchRace', async () => {
  const data = await getAllRaces();
  return data;
});

export const updateRaceData = createAsyncThunk(
  'race/updateRaceData',
  async (name: string) => {
    const data = await reloadRaceData(name);
    return data;
  },
);

export const fetchScrapeRaces = createAsyncThunk(
  'race/fetchScrapeRaces',
  async () => {
    const data = await scrapeRaces();
    return data;
  },
);

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    resetRaceStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRace.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchRace.fulfilled,
        (state, action: PayloadAction<RaceDTO[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(fetchRace.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateRaceData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        updateRaceData.fulfilled,
        (state, action: PayloadAction<RaceDTO[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(updateRaceData.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetRaceStatus } = raceSlice.actions;

export default raceSlice.reducer;
