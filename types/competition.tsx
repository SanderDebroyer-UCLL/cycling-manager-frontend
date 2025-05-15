import { Race } from './cyclist';
import { User } from './user';

export interface CreateCompetitionDetails {
  name: string;
  races: string[];
  users: string[];
}

export interface Competition {
  id: string;
  name: string;
  races: Race[];
  users: User[];
}
