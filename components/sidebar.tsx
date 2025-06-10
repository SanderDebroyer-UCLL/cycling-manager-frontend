import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bike,
  ClipboardPen,
  Medal,
  SquareGanttChart,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCompetitionById,
  resetUpdateCompetitionStatus,
  updateCompetitionStatusRequest,
} from '@/features/competition/competition.slice';
import type { AppDispatch } from '@/store/store';
import { CompetitionDTO, CompetitionStatus } from '@/types/competition';
import { usePathname } from 'next/navigation';
import LoadingOverlay from './LoadingOverlay';
import { Button } from 'primereact/button';
import { isBefore, parse, parseISO } from 'date-fns';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const Sidebar = () => {
  const competition: CompetitionDTO | null = useSelector(
    (state: any) => state.competition.competitionDTO,
  );
  const updateCompetitionStateStatus = useSelector(
    (state: any) => state.competition.updateCompetitionStatus,
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
      dispatch(
        fetchCompetitionById(
          Number(
            Array.isArray(competitionId) ? competitionId[0] : competitionId,
          ),
        ),
      );
    }
  }, [dispatch, competition, competitionId]);

  useEffect(() => {
    if (updateCompetitionStateStatus === 'succeeded') {
      router.push(`/competities`);
      dispatch(resetUpdateCompetitionStatus());
    }
  }, [updateCompetitionStateStatus, router]);

  const shouldShowEndButton = (() => {
    if (!competition?.races?.length) return false;

    const race = competition.races[0];
    const stages = race?.stages ?? [];
    const lastStage = stages.at(-1);

    let comparisonDate: Date | null = null;

    if (lastStage?.date) {
      try {
        // Stage date is 'dd/MM' — uses current year
        comparisonDate = parse(lastStage.date, 'dd/MM', new Date());
      } catch (error) {
        console.warn('Failed to parse stage date:', lastStage.date);
      }
    } else if (race?.endDate) {
      try {
        // Race endDate is 'YYYY-MM-DD'
        comparisonDate = parseISO(race.endDate);
      } catch (error) {
        console.warn('Failed to parse race end date:', race.endDate);
      }
    }

    return !!comparisonDate && isBefore(comparisonDate, new Date());
  })();

  // Guard clause: Don't render sidebar until competition is loaded
  if (
    !competition ||
    competition.id?.toString() !== competitionId?.toString()
  ) {
    return (
      <>
        <LoadingOverlay />
      </>
    );
  }

  const confirmEnd = () => {
    confirmDialog({
      message: 'Ben je zeker dat je de competitie wilt beëindigen?',
      header: 'Bevestig',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'Accepteer',
      accept: () => {
        dispatch(
          updateCompetitionStatusRequest({
            competitionId: competition.id,
            competitionStatus: CompetitionStatus.FINISHED,
          }),
        );
      },
      reject: () => {},
    });
  };

  return (
    <div className="w-[280px] flex flex-col text-lg font-regular bg-surface py-8 text-dark-900 ">
      <ConfirmDialog />

      <div className="flex flex-col gap-4 content-between h-full">
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
          {competition.races[0].stages.length > 1 ? 'Wedstrijd' : 'Wedstrijden'}
        </div>
        <div className="flex flex-col pb-2">
          <Link
            href={`/competities/${competitionId}`}
            className={` ${isNotActive(['ritten', 'mijn-team', 'klassement', 'punten']) ? '!border-primary !font-semibold' : ''} flex gap-3 items-center border-l-4 border-surface hover:border-primary px-6 hover:font-semibold py-2`}
          >
            <SquareGanttChart size={18} className="stroke-dark-700" />
            Overzicht
          </Link>
          <Link
            href={`/competities/${competitionId}/ritten`}
            className={` ${isActive('ritten') ? '!border-primary !font-semibold' : ''} flex gap-3 items-center border-l-4 border-surface hover:border-primary px-6 hover:font-semibold py-2`}
          >
            <Bike size={18} className="stroke-dark-700" />
            {competition.races[0].stages.length > 1 ? 'Etappes' : 'Wedstrijden'}
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
          <Link
            href={`/competities/${competitionId}/punten`}
            className={` ${isActive('punten') ? '!border-primary !font-semibold' : ''} flex gap-3 items-center border-l-4 border-surface hover:border-primary px-6 hover:font-semibold py-2`}
          >
            <ClipboardPen size={18} className="stroke-dark-700" />
            Punten
          </Link>
        </div>
      </div>

      {shouldShowEndButton && (
        <div className="px-6 w-full">
          <Button
            loading={updateCompetitionStateStatus === 'loading'}
            onClick={confirmEnd}
            raised
            label="Beëindig competitie"
            className="!w-full"
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
