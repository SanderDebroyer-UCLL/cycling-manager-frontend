import CompetitieLayout from '@/components/competitieLayout';
import { fetchCompetitionById } from '@/features/competition/competition.slice';
import { AppDispatch } from '@/store/store';
import { Competition } from '@/types/competition';
import { Stage } from '@/types/grandtour';
import { useRouter } from 'next/router';
import { Calendar } from 'primereact/calendar';
import { Chart } from 'primereact/chart';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Nullable } from 'primereact/ts-helpers';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const index = () => {
  const router = useRouter();
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
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
        console.log('Start:', startDate);
        console.log('End:', endDate);
        setDates([startDate, endDate]);
        console.log(dates);
      }

      // Take the first race's stages
      const races = competition.races;
      const stages: Stage[] = races[0]?.stages || [];

      const labels = stages.map((_, idx) => idx + 1);
      const distancesRaw = stages.map((stage) => stage.distance ?? 0);
      const elevationsRaw = stages.map((stage) => stage.verticalMeters ?? 0);
      const distances = stages.map((stage) => stage.distance ?? null);
      const elevations = stages.map((stage) => stage.verticalMeters ?? null);

      const data = {
        labels,
        datasets: [
          {
            label: 'Distance (km)',
            data: distancesRaw,
            yAxisID: 'y', // Left axis
            barThickness: 30, // Adjust width here

            backgroundColor: documentStyle.getPropertyValue('--primary-500'),
          },
          {
            label: 'Elevation (m)',
            data: elevationsRaw,
            yAxisID: 'y1', // Right axis
            barThickness: 30, // Adjust width here
            backgroundColor: documentStyle.getPropertyValue('--primary-800'),
          },
        ],
      };

      const options = {
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: textColorSecondary },
            grid: { color: surfaceBorder },
          },
          y: {
            // Elevation axis
            type: 'linear',
            display: true,
            position: 'left',
            min: 0,
            ticks: { color: textColorSecondary },
            grid: { color: surfaceBorder },
          },
          y1: {
            // Distance axis
            type: 'linear',
            display: true,
            position: 'right',
            min: 0,
            ticks: { color: textColorSecondary },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      setChartData(data);
      setChartOptions(options);
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
    <div className="flex flex-col gap-12 py-12 px-8 w-full">
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
        <div className="flex flex-1/3 flex-col gap-2">
          <h3 className="font-semibold">Duur Competitie</h3>
          <div className="h-full p-4 flex justify-center rounded-lg shadow-md bg-surface-200">
            <Calendar value={dates} inline selectionMode="range" />
          </div>
        </div>
        <div className="flex flex-col flex-2/3 gap-4 w-full">
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <h3 className="font-semibold">Totale afstand</h3>
              <div className="flex flex-col justify-center h-26 gap-2 p-4  bg-surface-200 rounded-lg shadow-md font-semibold text-xl">
                {competition.races[0].stages
                  .map((stage) => Number(stage.distance))
                  .reduce((total, distance) => total + distance, 0)
                  .toFixed(1)}{' '}
                km
                <span className="text-sm font-normal">
                  verdeeld over {competition.races[0].stages.length} ritten{' '}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <h3 className="font-semibold">Totaal hoogtemeters</h3>
              <div className="flex flex-col justify-center h-26 gap-2 p-4  bg-surface-200 rounded-lg shadow-md font-semibold text-xl">
                {competition.races[0].stages
                  .map((stage) => Number(stage.verticalMeters))
                  .reduce((total, distance) => total + distance, 0)
                  .toFixed(0)}{' '}
                m
                <span className="text-sm font-normal">
                  Dat is{' '}
                  {(
                    competition.races[0].stages
                      .map((stage) => Number(stage.verticalMeters))
                      .reduce((total, distance) => total + distance, 0) / 1.82
                  ).toFixed(0)}{' '}
                  keer Niels
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Verdeling over de ritten</h3>
            <div className="bg-surface-200 rounded-lg shadow-md p-4">
              <Chart type="bar" data={chartData} options={chartOptions} />
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
