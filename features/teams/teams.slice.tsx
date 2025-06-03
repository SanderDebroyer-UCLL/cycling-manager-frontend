import { scrapeTeams } from '@/services/teams.service';
import { Team } from '@/types/team';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TeamsState {
  data: Team[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
const initialState: TeamsState = {
  data: [],
  status: 'idle',
};

export const fetchScrapeTeams = createAsyncThunk(
  'teams/fetchScrapeTeams',
  async () => {
    const data = await scrapeTeams();
    return data;
  },
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    resetTeamsStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScrapeTeams.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchScrapeTeams.fulfilled,
        (state, action: PayloadAction<Team[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(fetchScrapeTeams.rejected, (state) => {
        state.status = 'failed';
      });
  },
});
