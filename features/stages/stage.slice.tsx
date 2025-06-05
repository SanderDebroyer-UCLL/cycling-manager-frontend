import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { scrapeStages } from '@/services/stage.service';
import { StageDTO } from '@/types/race';

interface StagesState {
  data: StageDTO[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: StagesState = {
  data: [],
  status: 'idle',
};

export const fetchScrapeStages = createAsyncThunk(
  'race/fetchScrapeStages',
  async () => {
    const data = await scrapeStages();
    return data;
  },
);

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    resetStageStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScrapeStages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScrapeStages.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(fetchScrapeStages.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetStageStatus } = raceSlice.actions;

export default raceSlice.reducer;
