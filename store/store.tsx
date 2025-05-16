// store.ts or store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import raceReducer from '@/features/race/race.slice';
import userReducer from '@/features/user/user.slice';
import usersReducer from '@/features/users/users.slice';
import competitionReducer from '@/features/competition/competition.slice';
import competitionsReducer from '@/features/competitions/competitions.slice'


const store = configureStore({
  reducer: {
    race: raceReducer,
    user: userReducer,
    users: usersReducer,
    competition: competitionReducer,
    competitions: competitionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
