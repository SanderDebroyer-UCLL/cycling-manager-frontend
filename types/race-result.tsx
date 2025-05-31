import { Cyclist } from './cyclist';
import { Race } from './race';

export interface RaceResult {
  id: number;
  position: number;
  cyclist: Cyclist;
  time: string;
  race: Race;
}
