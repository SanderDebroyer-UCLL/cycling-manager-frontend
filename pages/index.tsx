// pages/index.tsx
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { AppDispatch, RootState } from '@/store/store';
import Navbar from '@/components/navbar';
import { Swords, Trophy } from 'lucide-react';
import { CalendarSearch } from 'lucide-react';
import bannerImage from '@/public/images/banner_image.avif';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-16 max-w-[70vw] mx-auto p-20 text-dark-700">
        <div className="w-full h-60 bg-surface-100 flex items-center justify-between gap-4 rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col gap-4 py-6 px-12">
            <h1 className="text-2xl font-semibold">
              Welcome to the cycling manager{' '}
            </h1>
            <p className="text-md">
              Race, manage your team, and lead them to victory!
            </p>
            <Link href={'/authentication/register'}>
              <Button label="Get started" />
            </Link>
          </div>
          <div className="max-w-[50%]">
            <Image
              src={bannerImage}
              alt=""
              className="object-contain w-full [mask-image:linear-gradient(to_right,transparent_0%,black_40%,black_100%)]"
            />
          </div>
        </div>
        <div className="w-full h-60 bg-surface-100 flex items-center gap-6 p-6 justify-around rounded-lg shadow-md">
          <div className="bg-surface-50 h-full w-full flex flex-col rounded-lg shadow-md p-4 gap-2">
            <div className="flex flex-col items-start">
              <CalendarSearch size={48} className="stroke-blue-500" />
            </div>
            <h3 className="font-medium text-md"> Choose your race</h3>
            <p className="text-sm">
              Select riders, assign roles, and form a winning strategy.
            </p>
          </div>
          <div className="bg-surface-50 h-full w-full flex flex-col rounded-lg shadow-md p-4 gap-2">
            <div className="flex flex-col items-start">
              <Swords size={48} className="stroke-blue-500" />
            </div>
            <h3 className="font-medium text-md">
              Compete against your friends
            </h3>
            <p className="text-sm">Prove who's the best manager.</p>
          </div>
          <div className="bg-surface-50 h-full w-full flex flex-col rounded-lg shadow-md p-4 gap-2">
            <div className="flex flex-col items-start">
              <Trophy size={48} className="stroke-blue-500" />
            </div>
            <h3 className="font-medium text-md">Achieve greatness</h3>
            <p className="text-sm">
              Beat your friends and climb the leaderboard.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
