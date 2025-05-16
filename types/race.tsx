import { Stage } from "./grandtour";

export interface Race2 {
  age: number;
  ranking: number;
  id: number;
  team_id: number;
  country: string;
  name: string;
}

export interface Race {
  id: string;
  name: string;
  stages: Stage[]
  startDate: Date;
  endDate: Date;
  niveau: string;
  distance: string;
}
