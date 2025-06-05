import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllCyclistss, scrapeCyclists } from '@/services/cyclists.service';
import { Cyclist, CyclistDTO } from '@/types/cyclist';

// Define Cyclists type based on your API response
export interface Cyclists {
  id: number;
  name: string;
  // add more fields as needed
}

interface CyclistsState {
  data: CyclistDTO[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CyclistsState = {
  data: [],
  status: 'idle',
};

export const fetchCyclists = createAsyncThunk(
  'cyclists/fetchCyclists',
  async () => {
    const data = await getAllCyclistss();
    return data;
  },
);

export const fetchScrapeCyclists = createAsyncThunk(
  'cyclists/fetchScrapeCyclists',
  async () => {
    const data = await scrapeCyclists();
    return data;
  },
);

const cyclistsSlice = createSlice({
  name: 'cyclists',
  initialState,
  reducers: {
    resetCyclistsStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCyclists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCyclists.fulfilled,
        (state, action: PayloadAction<CyclistDTO[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(fetchCyclists.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchScrapeCyclists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScrapeCyclists.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(fetchScrapeCyclists.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetCyclistsStatus } = cyclistsSlice.actions;
export default cyclistsSlice.reducer;
