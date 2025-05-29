// src/features/race/raceSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllRaces, reloadRaceData } from '@/services/race.service';

// Define Race type based on your API response
export interface Race {
  id: number;
  name: string;
  // add more fields as needed
}

interface RacesState {
  data: Race[];
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

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRace.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRace.fulfilled, (state, action: PayloadAction<Race[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRace.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateRaceData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        updateRaceData.fulfilled,
        (state, action: PayloadAction<Race[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(updateRaceData.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default raceSlice.reducer;
