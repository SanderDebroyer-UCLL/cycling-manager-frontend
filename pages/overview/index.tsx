import Navbar from '@/components/navbar2';

import { grandTours } from '@/const/data';
import { GrandTour } from '@/types/grandtour';
import Image from 'next/image';
import Link from 'next/link';

export default function Overview() {
  return (
    <>
      <div className="sticky top-0">
        <Navbar />
      </div>
      <main className="max-w-[70vw] mx-auto p-20 text-dark-700 class flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Actieve Competities</h2>
          <div className="w-full h-70 bg-surface-100 flex items-center justify-between gap-4 rounded-lg shadow-md overflow-hidden p-8">
            {grandTours.map((tour: GrandTour) => (
              <div
                className="relative rounded-lg shadow-md overflow-hidden h-full w-full"
                key={tour.name}
              >
                <Link href={`/competitions/${tour.href}`} key={tour.name}>
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent" />

                  <div className="relative z-10 p-4 flex items-center gap-4 text-2xl text-white font-medium font-manrope">
                    <Image
                      src={tour.icon}
                      className="object-contain h-12 w-12"
                      alt={''}
                    />
                    {tour.name}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
