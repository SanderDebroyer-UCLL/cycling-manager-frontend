import { Team } from './team';

export interface Cyclist {
  id: number;
  name: string;
  team: Team[];
  age: number;
  country: string;
  pointsScored?: number;
}
