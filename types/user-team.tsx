import { Competition } from './competition';
import { Cyclist, CyclistDTO } from './cyclist';
import { User, UserDTO } from './user';

export interface UserTeam {
  id: number;
  name: string;
  competitionId: number;
  cyclistAssignments: CyclistAssignment[];
  user: User;
}

export interface UserTeamDTO {
  id: number;
  name: string;
  competitionId: number;
  cyclistAssignments: CyclistAssignmentDTO[];
  user: UserDTO;
}

export interface CyclistAssignment {
  id: number;
  cyclist: Cyclist;
  role: CyclistRole;
  fromStage: number;
  toStage: number;
}

export interface CyclistAssignmentDTO {
  id: number;
  cyclist: CyclistDTO;
  role: CyclistRole;
  fromStage: number;
  toStage: number;
}

export enum CyclistRole {
  MAIN = 'MAIN',
  RESERVE = 'RESERVE',
}
