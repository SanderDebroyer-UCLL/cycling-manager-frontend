// src/features/race/raceSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllRaces } from '@/services/race.service';

// Define Race type based on your API response
export interface Race {
  id: string;
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
  return data as Race[];
});

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
      });
  },
});

export default raceSlice.reducer;
