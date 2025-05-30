import { Team } from './team';

export interface Cyclist {
  id: number;
  name: string;
  team: Team;
  age: number;
  country: string;
  pointsScored?: number;
  dnsReason?: string;
}

export interface CyclistDTO {
  id: number;
  name: string;
  ranking: number;
  age: number;
  country: string;
  cyclistUrl: string;
  team: Team;
  upcomingRaces: string[];
}
