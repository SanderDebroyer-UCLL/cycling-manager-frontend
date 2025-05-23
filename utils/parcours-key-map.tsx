import { ParcoursType } from '@/types/race';

export const ParcoursTypeKeyMap: Record<ParcoursType, string> = {
  [ParcoursType.FLAT]: 'Vlakke etappe',
  [ParcoursType.MOUNTAIN]: 'Bergetappe',
  [ParcoursType.HILLY]: 'Heuvelachtige etappe',
  [ParcoursType.HILLY_HILL_FINISH]: 'Heuvelachtig met aankomst bergop',
  [ParcoursType.MOUNTAIN_HILL_FINISH]: 'Bergen met aankomst bergop',
};

export const parcoursDescriptions: Record<ParcoursType, string> = {
  FLAT: 'Ideaal voor sprinters',
  HILLY: 'Goed voor punchers',
  HILLY_HILL_FINISH: 'Zwaar eindstuk',
  MOUNTAIN: 'Voordeel voor klimmers',
  MOUNTAIN_HILL_FINISH: 'Echte bergetappe',
};
