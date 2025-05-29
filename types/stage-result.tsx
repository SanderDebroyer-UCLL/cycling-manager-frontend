import { Cyclist } from './cyclist';
import { Stage } from './race';

export interface StageResult {
  id: number;
  position: number;
  cyclist: Cyclist;
  stage: Stage;
}
