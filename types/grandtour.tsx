import { StaticImageData } from 'next/image';

export interface GrandTour {
  name: string;
  image: StaticImageData;
  href: string;
  iconLight: StaticImageData;
  iconDark: StaticImageData;
}
