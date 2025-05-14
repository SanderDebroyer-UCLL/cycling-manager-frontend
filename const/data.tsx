// grandToursData.tsx

import tourDeFranceBanner from '@/public/images/tour_de_france_banner.webp';
import giroBanner from '@/public/images/giro_banner.jpg';
import vueltaBanner from '@/public/images/vuelta_banner.jpg';
import tdfIcon from '@/public/images/tdf-icon.png';
import giroIcon from '@/public/images/giro-icon.png';
import vueltaIcon from '@/public/images/vuelta-icon.png';
import { GrandTour } from '@/types/grandtour';
import { profile } from 'console';
import { User } from '@/types/user';

export const grandTours: GrandTour[] = [
  {
    name: 'Tour de France',
    image: tourDeFranceBanner,
    href: '/competitions/tour-de-france',
    icon: tdfIcon,
  },
  {
    name: 'Giro d’Italia',
    image: giroBanner,
    href: '/competitions/giro-ditalia',
    icon: giroIcon,
  },
  {
    name: 'Vuelta a España',
    image: vueltaBanner,
    href: '/competitions/vuelta-a-espana',
    icon: vueltaIcon,
  },
];

export const users: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    password: 'password123',
    role: 'admin',
    score: 100,
    profilePicture: 'https://randomuser.me/api/portraits',
  },
];
