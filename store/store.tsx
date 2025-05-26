// store.ts or store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import raceReducer from '@/features/race/race.slice';
import userReducer from '@/features/user/user.slice';
import usersReducer from '@/features/users/users.slice';
import competitionReducer from '@/features/competition/competition.slice';
import competitionsReducer from '@/features/competitions/competitions.slice';
import userTeamsReducer from '@/features/user-teams/user-teams.slice';
import cyclistsReducer from '@/features/cyclists/cyclists.slice';
import stageResultsReducer from '@/features/stage-results/stage-results.slice';
import raceResultsReducer from '@/features/race-results/race-results.slice';

const store = configureStore({
  reducer: {
    race: raceReducer,
    user: userReducer,
    users: usersReducer,
    competition: competitionReducer,
    competitions: competitionsReducer,
    userTeams: userTeamsReducer,
    cyclists: cyclistsReducer,
    stageResults: stageResultsReducer,
    raceResults: raceResultsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
