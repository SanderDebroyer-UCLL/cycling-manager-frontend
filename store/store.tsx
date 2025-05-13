// store.ts or store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import raceReducer from '@/features/race/race.slice';

const store = configureStore({
  reducer: {
    race: raceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
