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
  stages: Stage[];
  startDate: string;
  endDate: string;
  niveau: string;
  distance: string;
}

export interface Stage {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  date: string;
  startTime?: string;
  distance: string;
  verticalMeters: string;
  results: StageResult[];
}


export interface StageResult {
  position: number;
  rider: string;
  team: string;
  timeGap: string;
}