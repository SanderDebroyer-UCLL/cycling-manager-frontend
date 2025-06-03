export interface Points {
  points: number;
  fullName: string;
  userid: number;
}

export interface PointsPerCyclist {
  points: number;
  cyclistName: string;
  cyclistId: number;
  userId: number;
  isCyclistActive: boolean;
}

export interface MainReservePointsCyclist {
  mainCyclists: PointsPerCyclist[];
  reserveCyclists: PointsPerCyclist[];
}

export interface PointsReason {
  reason: string;
  points: number;
  cyclistId: number;
  userId: number;
  isCyclistActive: boolean;
  cyclistName: string;
}
