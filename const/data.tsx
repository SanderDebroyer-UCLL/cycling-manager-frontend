// grandToursData.tsx

import tourDeFranceBanner from '@/public/images/tour_de_france_banner.webp';
import giroBanner from '@/public/images/giro_banner.jpg';
import vueltaBanner from '@/public/images/vuelta_banner.jpg';
import tdfIconLight from '@/public/images/tdf-icon.png';
import tdfIconDark from '@/public/images/tdf-icon-dark.png';
import giroIconLight from '@/public/images/giro-icon.png';
import giroIconDark from '@/public/images/giro-icon-dark.png';
import vueltaIconLight from '@/public/images/vuelta-icon.png';
import { GrandTour } from '@/types/grandtour';
import { User } from '@/types/user';

export const grandTours: GrandTour[] = [
  {
    name: 'Tour de France',
    image: tourDeFranceBanner,
    href: '/competities/tour-de-france',
    iconLight: tdfIconLight,
    iconDark: tdfIconDark,
  },
  {
    name: 'Giro d’Italia',
    image: giroBanner,
    href: '/competities/giro-ditalia',
    iconLight: giroIconLight,
    iconDark: giroIconDark,
  },
  {
    name: 'Vuelta a España',
    image: vueltaBanner,
    href: '/competities/vuelta-a-espana',
    iconLight: vueltaIconLight,
    iconDark: vueltaIconLight,
  },
  {
    name: 'Vuelta a España',
    image: vueltaBanner,
    href: '/competities/vuelta-a-espana',
    iconLight: vueltaIconLight,
    iconDark: vueltaIconLight,
  },
  {
    name: 'Vuelta a España',
    image: vueltaBanner,
    href: '/competities/vuelta-a-espana',
    iconLight: vueltaIconLight,
    iconDark: vueltaIconLight,
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
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    name: '',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe@gmail.com',
    password: 'password123',
    role: 'user',
    score: 50,
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    name: '',
  },
  {
    id: 3,
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    password: 'alice123',
    role: 'user',
    score: 72,
    profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg',
    name: '',
  },
  {
    id: 4,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    password: 'bobsecure',
    role: 'user',
    score: 85,
    profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    name: '',
  },
  {
    id: 5,
    firstName: 'Clara',
    lastName: 'Williams',
    email: 'clara.williams@example.com',
    password: 'clara456',
    role: 'admin',
    score: 92,
    profilePicture: 'https://randomuser.me/api/portraits/women/5.jpg',
    name: '',
  },
  {
    id: 6,
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    password: 'david789',
    role: 'user',
    score: 60,
    profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg',
    name: '',
  },
  {
    id: 7,
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@example.com',
    password: 'emma321',
    role: 'user',
    score: 77,
    profilePicture: 'https://randomuser.me/api/portraits/women/7.jpg',
    name: '',
  },
  {
    id: 8,
    firstName: 'Frank',
    lastName: 'Miller',
    email: 'frank.miller@example.com',
    password: 'frankpass',
    role: 'user',
    score: 88,
    profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg',
    name: '',
  },
  {
    id: 9,
    firstName: 'Grace',
    lastName: 'Wilson',
    email: 'grace.wilson@example.com',
    password: 'grace2024',
    role: 'user',
    score: 66,
    profilePicture: 'https://randomuser.me/api/portraits/women/9.jpg',
    name: '',
  },
  {
    id: 10,
    firstName: 'Henry',
    lastName: 'Moore',
    email: 'henry.moore@example.com',
    password: 'henrysecure',
    role: 'user',
    score: 59,
    profilePicture: 'https://randomuser.me/api/portraits/men/10.jpg',
    name: '',
  },
];
