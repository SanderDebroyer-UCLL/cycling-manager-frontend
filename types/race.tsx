import { ResultType } from '@/const/resultType';

export interface Race {
  id: number;
  name: string;
  stages: Stage[];
  startDate: string;
  endDate: string;
  niveau: string;
  distance: string;
  parcoursType: ParcoursType;
}
export interface RaceDTO {
  id: number;
  name: string;
  niveau: string;
  startDate: string;
  endDate: string;
  distance: number;
  raceUrl: string;
  competitionIds: number[];
  stages: StageDTO[];
  parcoursType: ParcoursType;
}

export interface StageDTO {
  id: number;
  name: string;
  departure: string;
  arrival: string;
  date: string;
  startTime?: string;
  distance: number;
  stageUrl: string;
  verticalMeters: number;
  parcoursType: ParcoursType;
}

export interface Stage {
  id: number;
  name: string;
  departure: string;
  arrival: string;
  date: string;
  startTime?: string;
  distance: string;
  verticalMeters: string;
  results: StageResult[];
  parcoursType: ParcoursType;
}

export enum ParcoursType {
  FLAT = 'FLAT',
  MOUNTAIN = 'MOUNTAIN',
  HILLY = 'HILLY',
  HILLY_HILL_FINISH = 'HILLY_HILL_FINISH',
  MOUNTAIN_HILL_FINISH = 'MOUNTAIN_HILL_FINISH',
}

export interface StageResult {
  position: number;
  rider: string;
  team: string;
  timeGap: string;
  time: string;
  resultType: ResultType;
  scrapeResultType: ResultType;
}
