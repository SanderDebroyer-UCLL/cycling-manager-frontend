import CompetitieLayout from '@/components/competitieLayout';
import { fetchCompetitionById } from '@/features/competition/competition.slice';
import { AppDispatch } from '@/store/store';
import { Competition } from '@/types/competition';
import { Stage } from '@/types/grandtour';
import { Race } from '@/types/race';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Nullable } from 'primereact/ts-helpers';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const index = () => {
  const router = useRouter();
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalElevation, setTotalElevation] = useState(0);
  const [visible, setVisible] = useState(false);
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue(
    '--text-color-secondary',
  );
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  const competition: Competition = useSelector(
    (state: any) => state.competition.data,
  );
  const dispatch = useDispatch<AppDispatch>();
  const { competitionId } = router.query;

  useEffect(() => {
    if (competition) {
      if (competition.races[0].stages.length > 0) {
        const distance = competition.races[0].stages
          .map((stage) => Number(stage.distance))
          .reduce((total, distance) => total + distance, 0)
          .toFixed(1);
        setTotalDistance(Number(distance));
        const elevation = competition.races[0].stages
          .map((stage) => Number(stage.verticalMeters))
          .reduce((total, distance) => total + distance, 0)
          .toFixed(1);
        setTotalElevation(Number(elevation));
      } else {
        const distance = competition.races
          .map((race) => Number(race.distance))
          .reduce((total, distance) => total + distance, 0)
          .toFixed(1);
        setTotalDistance(Number(distance));
        const elevation = competition.races
          .map((race) => Number(race.distance))
          .reduce((total, distance) => total + distance, 0)
          .toFixed(1);
        setTotalElevation(Number(elevation));
      }
    }
  });

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
        (race) => new Date(race.startDate),
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
        setDates([startDate, endDate]);
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

  const reloadRaceData = () => {
    return 
  };

  return (
    <div className="flex flex-col gap-12 py-12 px-8 w-full">
      <Dialog
        header="Het is tijd om de competitie te starten!"
        visible={visible}
        style={{ width: '600px' }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p>Zorg dat alle spelers klaar zijn, zo verloopt alles vlot.</p>
            <ol className="list-decimal list-inside">
              <li>Bepaal de volgorde waarin spelers renners mogen kiezen.</li>
              <li>Kies om de beurt een renner en stel je team samen.</li>
              <li>Vorm zo het sterkste team.</li>
              <li>Start de competitie!</li>
            </ol>
          </div>
          <div className="flex justify-between">
            <Button label="Annuleer" severity="secondary" outlined />
            <Button
              label="Start"
              onClick={() =>
                router.push(`/competities/${competitionId}/mijn-team`)
              }
            />
          </div>
        </div>
      </Dialog>
      <div className="flex flex-col gap-6">
        <h2 className=" text-xl font-bold">
          Overzicht{' '}
          {competition.races[0].stages.length > 0
            ? competition.races[0].name
            : competition.name}
        </h2>
      </div>
      <Button
        label="Herlaad race data"
        className="max-w-48"
        onClick={reloadRaceData()}
      ></Button>
      <div className="flex gap-6 w-full">
        <div className="flex flex-1/4 flex-col gap-2">
          <h3 className="font-semibold">Duur Competitie</h3>
          <div className="p-3 flex justify-center rounded-lg shadow-md bg-surface-200">
            <Calendar value={dates} inline selectionMode="range" />
          </div>
        </div>
        <div className="flex flex-row flex-3/4 gap-4 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Totale afstand</h3>
              <div className="flex flex-col justify-center gap-2 p-4  bg-surface-200 rounded-lg shadow-md font-semibold text-xl">
                {totalDistance} km
                {competition.races[0].stages.length > 0 ? (
                  <span className="text-sm font-normal">
                    verdeeld over {competition.races[0].stages.length}{' '}
                    ritten{' '}
                  </span>
                ) : (
                  <span className="text-sm font-normal">
                    verdeeld over {competition.races.length} wedstrijden{' '}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Totaal hoogtemeters</h3>
              <div className="flex flex-col justify-center gap-2 p-4  bg-surface-200 rounded-lg shadow-md font-semibold text-xl">
                {totalElevation} m
                <span className="text-sm font-normal">
                  Dat is {(totalElevation / 1.82).toFixed(0)} keer Niels
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Ritten</h3>
            <div className="bg-surface-200 rounded-lg shadow-md p-4 max-h-[365px] overflow-y-auto">
              <DataTable
                selectionMode="single"
                selection={null}
                onSelectionChange={(e) =>
                  router.push(`/competities/${competitionId}/ritten`)
                }
                value={
                  competition.races[0].stages.length > 0
                    ? competition.races[0].stages
                    : competition.races
                }
                tableStyle={{ width: '100%' }}
              >
                <Column header="Naam" field="name" />
                <Column header="Afstand" field="distance" />
              </DataTable>{' '}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

index.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default index;
