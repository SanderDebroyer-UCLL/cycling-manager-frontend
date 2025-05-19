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
}
