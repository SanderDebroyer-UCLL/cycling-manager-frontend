import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bike, Medal, SquareGanttChart, Users } from 'lucide-react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompetitionById } from '@/features/competition/competition.slice';
import type { AppDispatch } from '@/store/store';
import { Competition } from '@/types/competition';
import { usePathname } from 'next/navigation';
import LoadingOverlay from './LoadingOverlay';

const Sidebar = () => {
  const competition: Competition = useSelector(
    (state: any) => state.competition.data,
  );
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const isActive = (path: string) => pathname.includes(path);
  const isNotActive = (paths: string[]) =>
    paths.every((p) => !pathname.includes(p));

  const router = useRouter();
  const { competitionId } = router.query;

  useEffect(() => {
    if (!competition && competitionId) {
      dispatch(fetchCompetitionById(competitionId.toString()));
    }
  }, [dispatch, competition, competitionId]);

  // Guard clause: Don't render sidebar until competition is loaded
  if (
    !competition ||
    competition.id?.toString() !== competitionId?.toString()
  ) {
    return <LoadingOverlay />;
  }

  return (
    <div className="w-[320px] flex flex-col gap-4 text-lg font-regular bg-surface py-8 text-dark-900 ">
      <div className="px-6 py-1 flex gap-2 items-center text-xl font-bold font-manrope pb-6">
        {competition.name}
      </div>
      <Link
        href="/competities"
        className="flex gap-3 px-6 py-1 font-semibold font-manrope items-center pb-4"
      >
        <ArrowLeft size={18} className="stroke-dark-700" /> Terug naar
        competities
      </Link>

      <div className="px-6 py-1 flex flex-col gap-4 uppercase text-md font-bold">
        Wedstrijd
      </div>
      <div className="flex flex-col pb-2">
        <Link
          href={`/competities/${competitionId}`}
          className={` ${isNotActive(['ritten', 'mijn-team', 'klassement']) ? '!border-primary !font-semibold' : ''} flex gap-3 items-center border-l-4 border-surface hover:border-primary px-6 hover:font-semibold py-2`}
        >
          <SquareGanttChart size={18} className="stroke-dark-700" />
          Overzicht
        </Link>
        <Link
          href={`/competities/${competitionId}/ritten`}
          className={` ${isActive('ritten') ? '!border-primary !font-semibold' : ''} flex gap-3 items-center border-l-4 border-surface hover:border-primary px-6 hover:font-semibold py-2`}
        >
          <Bike size={18} className="stroke-dark-700" />
          Ritten
        </Link>
      </div>

      <div className="px-6 flex flex-col gap-4 uppercase text-md font-bold">
        Competitie
      </div>
      <div className="flex flex-col pb-2">
        <Link
          href={`/competities/${competitionId}/mijn-team`}
          className={` ${isActive('mijn-team') ? '!border-primary !font-semibold' : ''} flex gap-3 items-center border-l-4 border-surface hover:border-primary px-6 hover:font-semibold py-2`}
        >
          <Users size={18} className="stroke-dark-700" />
          Mijn team
        </Link>
        <Link
          href={`/competities/${competitionId}/klassement`}
          className={` ${isActive('klassement') ? '!border-primary !font-semibold' : ''} flex gap-3 items-center border-l-4 border-surface hover:border-primary px-6 hover:font-semibold py-2`}
        >
          <Medal size={18} className="stroke-dark-700" />
          Klassement
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
