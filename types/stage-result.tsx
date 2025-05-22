import { Cyclist } from './cyclist';
import { Stage } from './race';

export interface StageResult {
  id: string;
  position: number;
  cyclist: Cyclist;
  stage: Stage;
}
