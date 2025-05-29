import { Race, RaceDTO, Stage } from './race';
import { User, UserDTO } from './user';

export interface CreateCompetitionDetails {
  name: string;
  userEmails: string[];
  raceIds: number[];
}

export interface CompetitionDTO {
  id: number;
  name: string;
  races: RaceDTO[];
  users: UserDTO[];
  competitionStatus: CompetitionStatus;
  maxMainCyclists: number;
  maxReserveCyclists: number;
  currentPick: number;
  competitionPicks: CompetitionPick[];
}

export interface Competition {
  id: number;
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
  id: number;
  userId: number;
  pickOrder: number;
}

export enum CompetitionStatus {
  SORTING = 'SORTING',
  SELECTING = 'SELECTING',
  STARTED = 'STARTED',
}
