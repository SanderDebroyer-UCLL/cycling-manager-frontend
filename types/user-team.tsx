import { Competition } from './competition';
import { Cyclist } from './cyclist';
import { User } from './user';

export interface UserTeam {
  id: number;
  name: string;
  competitionId: number;
  mainCyclists: Cyclist[];
  reserveCyclists: Cyclist[];
  user: User;
}
