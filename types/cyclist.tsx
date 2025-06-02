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
  dnsReason?: DropOutReason;
}

export enum DropOutReason {
  DNS = 'DNS', // Did Not Start
  DNF = 'DNF', // Did Not Finish
  DSQ = 'DSQ', // Disqualified
  OTL = 'OTL', // Outside Time Limit
  HD = 'HD', // Hors Délai (same as OTL but French term)
  AB = 'AB', // Abandon
  DF = 'DF', // Défaillance (mechanical/health issue)
  NP = 'NP', // Non-Partant (did not start, French term)
}
