import { Team } from './team';

export interface Cyclist {
  id: string;
  name: string;
  team: Team[];
  age: number;
  country: string;
  pointsScored?: number;
}
