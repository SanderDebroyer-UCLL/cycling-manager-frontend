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
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalElevation, setTotalElevation] = useState(0);
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

      const races = competition.races;
      const firstRaceWithStages = races.find((race) => race.stages.length > 0);
      const stages: Stage[] = firstRaceWithStages?.stages || [];

      let labels: number[] = [];
      let distances: string[] = [];
      let elevations: string[] = [];

      if (stages.length > 0) {
        labels = stages.map((_, idx) => idx + 1);
        distances = stages.map((stage) => stage.distance ?? 0);
        elevations = stages.map((stage) => stage.verticalMeters ?? 0);
      } else {
        labels = races.map((_, idx) => idx + 1);
        distances = races.map((race) => race.distance ?? 0);
        // We assume elevation is 0 if stages are missing
        elevations = races.map((race) => race.distance ?? 0);
      }

      const data = {
        labels,
        datasets: [
          {
            label: 'Distance (km)',
            data: distances,
            yAxisID: 'y', // Left axis
            barThickness: 30, // Adjust width here

            backgroundColor: documentStyle.getPropertyValue('--primary-500'),
          },
          {
            label: 'Elevation (m)',
            data: elevations,
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
      <div className="flex flex-col gap-6">
        <h2 className=" text-xl font-bold">
          Overzicht{' '}
          {competition.races[0].stages.length > 0
            ? competition.races[0].name
            : competition.name}
        </h2>
      </div>
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
            <div className="flex flex-1 flex-col gap-2">
              <h3 className="font-semibold">Totaal hoogtemeters</h3>
              <div className="flex flex-col justify-center h-26 gap-2 p-4  bg-surface-200 rounded-lg shadow-md font-semibold text-xl">
                {totalElevation} m
                <span className="text-sm font-normal">
                  Dat is {(totalElevation / 1.82).toFixed(0)} keer Niels
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
