// src/features/user/userSelectors.ts
import { RootState } from '@/store/store'; // or wherever your store type is
export const selectCurrentUser = (state: RootState) => state.user.data;
