import { StaticImageData } from 'next/image';

export interface GrandTour {
  name: string;
  image: StaticImageData;
  href: string;
  iconLight: StaticImageData;
  iconDark: StaticImageData;
}

export interface Stage{
  name: string;
  date: string;
  distance: string;
  type: string;
  results: StageResult[];
}

export interface StageResult {
  position: number;
  rider: string;
  team: string;
  timeGap: string;
};