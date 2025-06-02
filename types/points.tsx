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
