import { Button } from 'primereact/button';
import { Swords, Trophy } from 'lucide-react';
import { CalendarSearch } from 'lucide-react';
import bannerImage from '@/public/images/banner_image.avif';
import Image from 'next/image';
import Link from 'next/link';
import HomeLayout from '@/components/layout/homeLayout';
import { ReactNode } from 'react';
import AnimatedContent from '@/components/AnimatedContent';

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-16 max-w-[70vw] mx-auto p-20 text-dark-700">
        <AnimatedContent
          distance={0}
          direction="vertical"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.7}
          animateOpacity
          scale={1}
          delay={0.0}
        >
          <div className="w-full h-60 bg-surface-container flex items-center justify-between gap-4 rounded-xl shadow-md overflow-hidden">
            <div className="flex flex-col gap-4 py-6 px-12">
              <h1 className="text-2xl font-semibold">
                Welkom bij Cycling Manager
              </h1>
              <p className="text-md">
                Race, stel je team samen en leid ze naar de overwinning!
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
        </AnimatedContent>
        <div className="w-full h-60 flex items-center gap-6 justify-around rounded-xl">
          <AnimatedContent
            distance={0}
            direction="vertical"
            reverse={false}
            duration={1}
            ease="power3.out"
            initialOpacity={0.7}
            animateOpacity
            scale={0.98}
            delay={0.0}
          >
            <div className="bg-surface-container flex flex-1 flex-col rounded-xl shadow-md p-10 gap-2">
              <div className="flex flex-col items-start">
                <CalendarSearch size={48} className="stroke-primary" />
              </div>
              <h3 className="font-medium text-md"> Kies je race</h3>
              <p className="text-sm">
                Selecteer je renners, maak de juiste keuzes en win de race.
              </p>
            </div>
          </AnimatedContent>
          <AnimatedContent
            distance={0}
            direction="vertical"
            reverse={false}
            duration={1}
            ease="power3.out"
            initialOpacity={0.7}
            animateOpacity
            scale={0.98}
            delay={0.15}
          >
            <div className="bg-surface-container flex flex-1 flex-col rounded-xl shadow-md p-10 gap-2">
              <div className="flex flex-col items-start">
                <Swords size={48} className="stroke-primary" />
              </div>
              <h3 className="font-medium text-md">
                Ga de strijd aan met je vrienden
              </h3>
              <p className="text-sm">
                Laat zien wie de echte meesterstrateeg is.
              </p>
            </div>
          </AnimatedContent>
          <AnimatedContent
            distance={0}
            direction="vertical"
            reverse={false}
            duration={1}
            ease="power3.out"
            initialOpacity={0.7}
            animateOpacity
            scale={0.98}
            delay={0.3}
          >
            <div className="bg-surface-container flex flex-1 flex-col rounded-xl shadow-md p-10 gap-2">
              <div className="flex flex-col items-start">
                <Trophy size={48} className="stroke-primary" />
              </div>
              <h3 className="font-medium text-md">Schrijf geschiedenis</h3>
              <p className="text-sm">
                Versla je vrienden en beklim het klassement tot aan de top.
              </p>
            </div>{' '}
          </AnimatedContent>
        </div>
      </main>
    </>
  );
}

Home.getLayout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;
