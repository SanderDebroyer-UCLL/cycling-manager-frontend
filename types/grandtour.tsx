import { StaticImageData } from 'next/image';

export interface GrandTour {
  name: string;
  image: StaticImageData;
  href: string;
  iconLight: StaticImageData;
  iconDark: StaticImageData;
}

export interface Stage {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  date: string;
  startTime: string;
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
