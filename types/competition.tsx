import { Race } from './race';
import { User } from './user';

export interface CreateCompetitionDetails {
  name: string;
  userEmails: string[];
  raceIds: number[];
}

export interface Competition {
  id: string;
  name: string;
  races: Race[];
  users: User[];
  competitionStatus: CompetitionStatus;
  competitionPicks: CompetitionPick[];
  maxMainCyclists: number;
  maxReserveCyclists: number;
  currentPick: number;
}

export interface CompetitionPick {
  id: string;
  userId: number;
  pickOrder: number;
}

export enum CompetitionStatus {
  SORTING = 'SORTING',
  SELECTING = 'SELECTING',
  STARTED = 'STARTED',
}
