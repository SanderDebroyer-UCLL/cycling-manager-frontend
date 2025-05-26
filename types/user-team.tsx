import { Competition } from './competition';
import { Cyclist } from './cyclist';
import { User } from './user';

export interface UserTeam {
  id: string;
  name: string;
  competitionId: string;
  mainCyclists: Cyclist[];
  reserveCyclists: Cyclist[];
  user: User;
}
