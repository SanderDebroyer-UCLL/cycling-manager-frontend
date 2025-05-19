import CompetitieLayout from '@/components/competitieLayout';
import { fetchCompetitionById } from '@/features/competition/competition.slice';
import { AppDispatch } from '@/store/store';
import { Competition } from '@/types/competition';
import { useRouter } from 'next/router';
import { Calendar } from 'primereact/calendar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Nullable } from 'primereact/ts-helpers';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const index = () => {
  const router = useRouter();
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
  const competition: Competition = useSelector(
    (state: any) => state.competition.data
  );
  const dispatch = useDispatch<AppDispatch>();
  const { competitionId } = router.query;

  useEffect(() => {
    if (
      competition &&
      competitionId &&
      competition.id.toString().trim() !== competitionId.toString().trim()
    ) {
      dispatch(fetchCompetitionById(competitionId.toString()));
    }
  }, [dispatch, competition, competitionId]);

  useEffect(() => {
    if (competition) {
      const startDates = competition.races.map(
        (race) => new Date(race.startDate)
      );
      const endDates = competition.races.map((race) => new Date(race.endDate));
      const startDate =
        startDates.length > 0
          ? new Date(Math.min(...startDates.map((date) => date.getTime())))
          : null;
      const endDate =
        endDates.length > 0
          ? new Date(Math.max(...endDates.map((date) => date.getTime())))
          : null;
      if (startDate && endDate) {
        console.log('Start:', startDate);
        console.log('End:', endDate);
        setDates([startDate, endDate]);
        console.log(dates);
      }
    }
  }, [dispatch, competition]);

  if (!competition) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-surface-100 z-9999">
        <ProgressSpinner
          style={{ width: '100px', height: '100px' }}
          strokeWidth="8"
          className="stroke-primary-500"
          animationDuration=".5s"
        />
      </div>
    );
  }

  return (
    <div className=" py-12 px-8 w-full">
      {competition.races[0].niveau.startsWith('2') ? (
        <div className="flex flex-col gap-6">
          <h2 className=" text-xl font-bold">
            Overzicht {competition.races[0].name}{' '}
          </h2>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <h2>Races in competitie</h2>
        </div>
      )}
      <div className="flex gap-6 w-full">
        <div>
          <h3>Duur Competitie</h3>
          <Calendar value={dates} inline selectionMode="range" />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-4">
            <div className="flex-1">
              <h3>Totale afstand</h3>
              <div className="flex p-4 bg-surface-200 rounded-lg shadow-md font-semibold text-xl">
                {competition.races[0].stages
                  .map((stage) => Number(stage.distance))
                  .reduce((total, distance) => total + distance, 0)
                  .toFixed(1)}
                km
              </div>
            </div>
            <div className="flex-1">
              <h3>Totaal hoogtemeters</h3>
            </div>
          </div>
          <div>Verdeling over de ritten</div>
        </div>
      </div>
      {/* <div className="w-full h-70 bg-surface-100 flex flex-col gap-4 shadow-md overflow-x-auto p-8">
        <div className="flex flex-col gap-1 justify-center">
          Van:{' '}
          {new Date(competition.races[0].startDate).toLocaleDateString('nl-NL')}{' '}
          Tot:{' '}
          {new Date(competition.races[0].endDate).toLocaleDateString('nl-NL')}
        </div>
        <div className="flex items-center">
          Totale afstand:{' '}
          {competition.races[0].stages
            .map((stage) => Number(stage.distance))
            .reduce((total, distance) => total + distance, 0)
            .toFixed(1)}
          km
        </div>
        <div className="flex items-center">
          Totaal hoogtemeters:{' '}
          {competition.races[0].stages
            .map((stage) => Number(stage.verticalMeters))
            .reduce((total, distance) => total + distance, 0)
            .toFixed(1)}
          m
        </div>
      </div> */}
    </div>
  );
};

index.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default index;
