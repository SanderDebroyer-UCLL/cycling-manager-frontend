import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllCyclistss } from '@/services/cyclists.service';
import { Cyclist } from '@/types/cyclist';

// Define Cyclists type based on your API response
export interface Cyclists {
  id: string;
  name: string;
  // add more fields as needed
}

interface CyclistsState {
  data: Cyclist[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CyclistsState = {
  data: [],
  status: 'idle',
};

export const fetchCyclists = createAsyncThunk('cyclists/fetchCyclists', async () => {
  const data = await getAllCyclistss();
  return data as Cyclist[];
});

const cyclistsSlice = createSlice({
  name: 'cyclists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCyclists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCyclists.fulfilled, (state, action: PayloadAction<Cyclist[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCyclists.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default cyclistsSlice.reducer;
