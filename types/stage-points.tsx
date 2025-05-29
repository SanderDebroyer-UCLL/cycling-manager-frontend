export interface StagePoints {
  points: number;
  fullName: string;
  userid: number;
}

export interface StagePointsPerCyclist {
  points: number;
  cyclistName: string;
  cyclistId: number;
  userId: number;
  isCyclistActive: boolean;
}

export interface MainReserveStagePointsCyclist {
  mainCyclists: StagePointsPerCyclist[];
  reserveCyclists: StagePointsPerCyclist[];
}
