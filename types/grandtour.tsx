import { StaticImageData } from 'next/image';

export interface GrandTour {
  name: string;
  image: StaticImageData;
  href: string;
  iconLight: StaticImageData;
  iconDark: StaticImageData;
}


export interface StageResult {
  position: number;
  rider: string;
  team: string;
  timeGap: string;
};