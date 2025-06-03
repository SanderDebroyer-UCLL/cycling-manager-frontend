import { Button } from 'primereact/button';
import { Swords, Trophy } from 'lucide-react';
import { CalendarSearch } from 'lucide-react';
import bannerImage from '@/public/images/banner_image.avif';
import Image from 'next/image';
import Link from 'next/link';
import HomeLayout from '@/components/layout/homeLayout';
import { ReactNode } from 'react';

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-16 max-w-[70vw] mx-auto p-20 text-dark-700">
        <div className="w-full h-60 bg-surface-container flex items-center justify-between gap-4 rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col gap-4 py-6 px-12">
            <h1 className="text-2xl font-semibold">
              Welkom op cycling manager{' '}
            </h1>
            <p className="text-md">
              Race, manage je team, en leid ze tot de overwinning!
            </p>
            <Link href={'/authenticatie/register'}>
              <Button label="Begin!" />
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
        <div className="w-full h-60 flex items-center gap-6 justify-around rounded-xl">
          <div className="bg-surface-container h-full w-full flex flex-col rounded-xl shadow-md p-10 gap-2">
            <div className="flex flex-col items-start">
              <CalendarSearch size={48} className="stroke-primary" />
            </div>
            <h3 className="font-medium text-md"> Kies je race</h3>
            <p className="text-sm">
              Selecteer renners, wijs rollen toe en vorm een winnende strategie.
            </p>
          </div>
          <div className="bg-surface-container h-full w-full flex flex-col rounded-xl shadow-md p-10 gap-2">
            <div className="flex flex-col items-start">
              <Swords size={48} className="stroke-primary" />
            </div>
            <h3 className="font-medium text-md">
              Neem het op tegen je vrienden
            </h3>
            <p className="text-sm">Bewijs wie de beste manager is.</p>
          </div>
          <div className="bg-surface-container h-full w-full flex flex-col rounded-xl shadow-md p-10 gap-2">
            <div className="flex flex-col items-start">
              <Trophy size={48} className="stroke-primary" />
            </div>
            <h3 className="font-medium text-md">Bereik grootse dingen</h3>
            <p className="text-sm">
              Versla je vrienden en klim naar de top van het klassement.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

Home.getLayout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;
