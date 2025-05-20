import CompetitieLayout from '@/components/competitieLayout';
import { fetchCompetitionById } from '@/features/competition/competition.slice';
import { AppDispatch } from '@/store/store';
import { Competition } from '@/types/competition';
import { Stage } from '@/types/grandtour';
import { Race } from '@/types/race';
import { useRouter } from 'next/router';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, {
  CSSProperties,
  ReactNode,
  use,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

const index = () => {
  const router = useRouter();
  const { competitionId } = router.query;

  const competition: Competition = useSelector(
    (state: any) => state.competition.data,
  );

  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  const [activeRace, setActiveRace] = useState<Race | null>(null);

  useEffect(() => {
    if (competition && activeRace === null) {
      setActiveRace(competition.races[0]);
    }
  });
  useEffect(() => {
    if (competition && activeStage === null) {
      setActiveStage(competition.races[0].stages[0]);
    }
  });

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (
      competition &&
      competitionId &&
      competition.id.toString().trim() !== competitionId.toString().trim()
    ) {
      dispatch(fetchCompetitionById(competitionId.toString()));
    }
  }, [dispatch, competition, competitionId]);

  const container: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#e9eff5', // Equivalent to Tailwind's surface-200 (approximate)
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // shadow-md approximation
    borderRadius: '0.5rem', // rounded-lg
    padding: '1rem', // p-4
    cursor: 'pointer',
    gap: '0.5rem', // gap-2
  };

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
    <div>
      <div className="flex flex-col gap-12 py-12 px-8 w-full">
        <div className="flex flex-col gap-6">
          <h2 className=" text-xl font-bold">
            <h2>
              Ritten{' '}
              {competition.races[0].stages.length > 0
                ? competition.races[0].name
                : competition.name}
            </h2>
          </h2>
        </div>

        <div className="flex gap-10 w-full overflow-x-auto">
          {competition.races[0].stages.length > 0
            ? competition.races[0].stages.map((stage, index) => (
                <div
                  onClick={() => {
                    setActiveStage(stage);
                  }}
                  key={stage.id}
                  className="flex flex-col bg-surface-200 shadow-md rounded-lg mb-4 p-4 cursor-pointer gap-2 w-60"
                >
                  <p>Stage {index + 1}</p>
                  <p className="truncate overflow-hidden whitespace-nowrap">
                    {stage.name}
                  </p>
                  <p>
                    {(() => {
                      const [day, month] = stage.date.split('/').map(Number);
                      const year = new Date(
                        competition.races[0].startDate,
                      ).getFullYear();
                      const fullDate = new Date(year, month - 1, day); // Month is 0-based in JS
                      return fullDate.toLocaleDateString('nl');
                    })()}
                  </p>
                </div>
              ))
            : competition.races.map((race, index) => (
                <div
                  onClick={() => {
                    setActiveRace(race);
                  }}
                  key={race.id}
                  className="flex flex-col bg-surface-200 shadow-md rounded-lg mb-4 p-4 cursor-pointer gap-2 w-60"
                >
                  <p>Race {index + 1}</p>
                  <p className="truncate overflow-hidden whitespace-nowrap">
                    {race.name}
                  </p>
                  <p>{new Date(race.startDate).toLocaleDateString('nl')}</p>
                </div>
              ))}
        </div>

        {competition.races[0].stages.length > 0 ? (
          <div className="flex gap-6 w-full">
            <div className="flex flex-1/2 flex-col gap-4 h-80">
              <h3 className="font-semibold">Overzicht {activeStage?.name}</h3>
              <div className="flex w-full gap-4">
                <div style={container} className="w-full flex-1">
                  {activeStage?.distance} km
                </div>
                <div style={container} className="w-full flex-1">
                  {activeStage?.verticalMeters} meter
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div style={container} className="w-full flex-1">
                  {activeStage?.startTime}
                </div>
                <div style={container} className="w-full flex-1">
                  Type
                </div>
              </div>
              <div style={container} className="h-full">
                Punten verdiend per speler
              </div>
            </div>
            <div className="flex flex-col flex-1/2 gap-4 w-full h-80">
              <h3 className="font-semibold">Uitslagen Rit</h3>
              <div style={container} className="w-full h-full">
                {activeStage?.name}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-6 w-full">
            <div className="flex flex-1/2 flex-col gap-4 h-80">
              <h3 className="font-semibold">Overzicht {activeRace?.name}</h3>
              <div className="flex w-full gap-4">
                <div style={container} className="w-full flex-1">
                  {activeRace?.distance} km
                </div>
                <div style={container} className="w-full flex-1">
                  {activeRace?.distance} meter
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div style={container} className="w-full flex-1">
                  {activeRace?.startDate}
                </div>
                <div style={container} className="w-full flex-1">
                  {activeRace?.name}
                </div>
              </div>
              <div style={container} className="h-full">
                Punten verdiend per speler
              </div>
            </div>
            <div className="flex flex-col flex-1/2 gap-4 w-full h-80">
              <h3 className="font-semibold">Uitslagen Rit</h3>

              <div style={container} className="h-full">
                {activeRace?.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

index.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default index;
