import { grandTours } from '@/const/data';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Bike, Medal, SquareGanttChart, Users } from 'lucide-react';
import { useRouter } from 'next/router';

const sidebar = () => {
  const tour = grandTours[0];

  const router = useRouter();
  const { competitionId } = router.query;

  return (
    <div className="h-[100vh] w-70 border-r-1 flex flex-col gap-4 text-lg font-regular border-surface-500 bg-surface-100 py-8 text-dark-700">
      <div className="px-6 py-1 flex gap-2 items-center text-xl font-bold font-manrope pb-6">
        <Image src={tour.iconDark} alt={tour.name} width={40} height={40} />
        {tour.name}
      </div>
      <Link
        href="/competitions"
        className="flex gap-3 px-6 py-1 font-semibold font-manrope items-center pb-4"
      >
        <ArrowLeft size={18} className="stroke-dark-700" /> Terug naar
        competities
      </Link>
      <div className="px-6 py-1 flex flex-col gap-4 uppercase text-md font-bold">
        Wedstrijd
      </div>
      <div className="flex flex-col gap-2 pb-2">
        <Link
          href={`/competitions/${competitionId}`}
          className=" flex gap-3 items-center hover:border-l-3 border-l-3 border-surface-100 hover:border-primary-500 px-6 py-1 hover:text-dark-500 hover:font-semibold"
        >
          <SquareGanttChart size={18} className="stroke-dark-700" />
          Overview
        </Link>
        <Link
          href={`/competitions/${competitionId}/ritten`}
          className="flex gap-3 items-center hover:border-l-3 border-l-3 border-surface-100 hover:border-primary-500 px-6 py-1 hover:text-dark-500 hover:font-semibold"
        >
          <Bike size={18} className="stroke-dark-700" />
          Ritten
        </Link>
      </div>
      <div className="px-6 py-1 flex flex-col gap-4 uppercase text-md font-bold">
        Competitie
      </div>
      <div className="flex flex-col gap-2 pb-2">
        <Link
          href={`/competitions/${competitionId}/mijn-team`}
          className=" flex gap-3 items-center hover:border-l-3 border-l-3 border-surface-100 hover:border-primary-500 px-6 py-1 hover:text-dark-500 hover:font-semibold"
        >
          <Users size={18} className="stroke-dark-700" />
          Mijn team
        </Link>
        <Link
          href={`/competitions/${competitionId}/klassement`}
          className=" flex gap-3 items-center hover:border-l-3 border-l-3 border-surface-100 hover:border-primary-500 px-6 py-1 hover:text-dark-500 hover:font-semibold"
        >
          <Medal size={18} className="stroke-dark-700" />
          Klassement
        </Link>
      </div>
    </div>
  );
};

export default sidebar;
