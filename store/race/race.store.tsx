// src/features/race/raceSlice.js
import { getAllRaces } from '@/services/race.api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRace = createAsyncThunk('race/fetchRace', async () => {
  const data = await getAllRaces();
  return data;
});

const raceSlice = createSlice({
  name: 'race',
  initialState: {
    data: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRace.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRace.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRace.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export default raceSlice.reducer;
