import CompetitieLayout from '@/components/competitieLayout';
import { fetchCompetitionById } from '@/features/competition/competition.slice';
import {
  fetchRaceResultsByRaceId,
  resetRaceResultsStatus,
} from '@/features/race-results/race-results.slice';
import {
  fetchStageResultsByStageId,
  resetStageResultsStatus,
} from '@/features/stage-results/stage-results.slice';
import { AppDispatch } from '@/store/store';
import { Competition } from '@/types/competition';
import { ParcoursType, Race, Stage, StageResult } from '@/types/race';
import { RaceResult } from '@/types/race-result';
import {
  parcoursDescriptions,
  ParcoursTypeKeyMap,
} from '@/utils/parcours-key-map';
import { useRouter } from 'next/router';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
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

  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  const [activeRace, setActiveRace] = useState<Race | null>(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [stageResultsState, setStageResultsState] = useState<StageResult[]>([]);
  const [raceResultsState, setRaceResultsState] = useState<RaceResult[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const competition: Competition = useSelector(
    (state: any) => state.competition.data,
  );
  const stageResults: StageResult[] = useSelector(
    (state: any) => state.results.data,
  );
  const raceResults: RaceResult[] = useSelector(
    (state: any) => state.raceResults.data,
  );
  const stageResultsStatus: string = useSelector(
    (state: any) => state.results.status,
  );
  const raceResultsStatus: string = useSelector(
    (state: any) => state.raceResults.status,
  );

  useEffect(() => {
    setStageResultsState(stageResults);
  }, [stageResults]);

  useEffect(() => {
    setRaceResultsState(raceResults);
  }, [raceResults]);

  useEffect(() => {
    if (stageResultsStatus === 'idle' && activeStage?.id) {
      dispatch(fetchStageResultsByStageId(activeStage.id));
    }
  }, [dispatch, stageResultsStatus, activeStage?.id]);

  useEffect(() => {
    if (raceResultsStatus === 'idle' && activeRace?.id) {
      dispatch(fetchRaceResultsByRaceId(activeRace.id));
    }
  }, [dispatch, stageResultsStatus, activeStage?.id]);

  useEffect(() => {
    if (raceResultsStatus === 'idle' && activeRace?.id) {
      dispatch(fetchRaceResultsByRaceId(activeRace.id));
    }
  }, [dispatch, raceResultsStatus, activeRace?.id]);

  useEffect(() => {
    if (stageResultsStatus === 'loading') {
      setResultLoading(true);
    } else {
      setResultLoading(false);
    }
  }, [resultLoading]);

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
    backgroundColor: '#f4f6f9', // Equivalent to Tailwind's surface-200 (approximate)
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
      <div className="flex flex-col gap-12 w-full">
        <div className="flex flex-col gap-6">
          <h2 className=" text-xl font-bold">
            Ritten{' '}
            {competition.races[0].stages.length > 0
              ? competition.races[0].name
              : competition.name}
          </h2>
        </div>

        <div className="flex gap-10 w-full overflow-x-auto">
          {competition.races[0].stages.length > 0
            ? competition.races[0].stages.map((stage, index) => (
                <div
                  onClick={() => {
                    setActiveStage(stage);
                    dispatch(resetStageResultsStatus()); // reset before fetch effect can run
                  }}
                  key={stage.id}
                  className="flex flex-col shrink-0 bg-surface-100 shadow-md rounded-lg mb-4 p-4 cursor-pointer gap-2 w-60"
                >
                  <p>Stage {index + 1}</p>
                  <p className="truncate overflow-hidden whitespace-nowrap">
                    {stage.name.split('|')[1]}
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
                    dispatch(resetRaceResultsStatus()); // reset before fetch effect can run
                  }}
                  key={race.id}
                  className="flex flex-col bg-surface-100 shadow-md rounded-lg mb-4 p-4 cursor-pointer gap-2 w-60"
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
          <div className="flex gap-10 w-full h-[525px]">
            <div className="flex flex-1/2 flex-col gap-5">
              <h3 className="font-semibold">Overzicht {activeStage?.name}</h3>
              <div></div>

              <div className="flex w-full gap-5">
                <div className="flex flex-col flex-1 gap-2">
                  <h3 className="font-semibold">Afstand</h3>
                  <div className="flex flex-col justify-center gap-2 p-4 bg-surface-100 rounded-lg shadow-md font-semibold text-xl">
                    {activeStage?.distance} km
                    <span className="text-sm font-normal">
                      {activeStage?.distance !== undefined &&
                        (Number(activeStage?.distance) < 8
                          ? 'Proloog'
                          : Number(activeStage?.distance) < 140
                            ? 'Korte rit'
                            : Number(activeStage?.distance) < 180
                              ? 'Gemiddelde rit'
                              : Number(activeStage?.distance) < 210
                                ? 'Lange rit'
                                : 'Koninklijke rit')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <h3 className="font-semibold">Hoogtemeters</h3>
                  <div className="flex flex-col justify-center gap-2 p-4 bg-surface-100 rounded-lg shadow-md font-semibold text-xl">
                    {activeStage?.verticalMeters} m
                    <span className="text-sm font-normal">
                      {activeStage?.verticalMeters !== undefined &&
                        (Number(activeStage.verticalMeters) < 500
                          ? 'Vlakke rit'
                          : Number(activeStage.verticalMeters) < 1000
                            ? 'Licht geaccidenteerd'
                            : Number(activeStage.verticalMeters) < 2000
                              ? 'Geaccidenteerd'
                              : Number(activeStage.verticalMeters) < 3000
                                ? 'Bergachtig'
                                : 'Zware bergrit')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full gap-5">
                <div className="flex flex-col flex-1 gap-2">
                  <h3 className="font-semibold">Lokale Starttijd</h3>
                  <div className="flex flex-col justify-center gap-2 p-4  bg-surface-100 rounded-lg shadow-md font-semibold text-xl">
                    {activeStage?.startTime &&
                    activeStage.startTime !== '-' &&
                    activeStage.startTime.includes('(')
                      ? activeStage.startTime.split('(')[0]
                      : 'Nog niet beschikbaar'}

                    <span className="text-sm font-normal">
                      {activeStage?.startTime &&
                      activeStage.startTime !== '-' &&
                      activeStage.startTime.includes('(')
                        ? activeStage.startTime.split('(')[1].split(')')[0]
                        : 'Wordt later aangekondigd'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <h3 className="font-semibold">Type Rit</h3>
                  <div className="flex flex-col justify-center gap-2 p-4 bg-surface-100 rounded-lg shadow-md font-semibold text-xl">
                    {ParcoursTypeKeyMap[
                      activeStage?.parcoursType as ParcoursType
                    ] ?? 'Niet beschikbaar'}
                    <span className="text-sm font-normal">
                      {activeStage?.parcoursType
                        ? parcoursDescriptions[
                            activeStage.parcoursType as ParcoursType
                          ]
                        : 'Geen parcoursinformatie'}
                    </span>
                  </div>
                </div>
              </div>
              <div></div>
              <div style={container} className="h-full">
                Punten verdiend per speler
              </div>
            </div>
            <div className="flex flex-col flex-1/2 gap-10 w-full">
              <div className="py-[10px]"></div>
              <div className="flex flex-col flex-1 gap-2">
                <h3 className="font-semibold">Uitslag Rit</h3>
                <div className="flex flex-col gap-2 p-4 bg-surface-100 rounded-lg shadow-md font-semibold text-xl h-full overflow-auto">
                  <DataTable
                    paginator
                    rows={5}
                    loading={resultLoading}
                    value={stageResultsState}
                    dataKey="id"
                    sortField="ranking"
                    sortOrder={1}
                    emptyMessage="Geen resultaten gevonden"
                  >
                    <Column field="ranking" header="Plaats" />
                    <Column field="name" header="Naam" />
                    <Column field="time" header="Tijd" />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-10 w-full h-[525px]">
            <div className="flex flex-1/2 flex-col gap-5">
              <h3 className="font-semibold">Overzicht {activeRace?.name}</h3>
              <div></div>

              <div className="flex w-full gap-5">
                <div className="flex flex-col flex-1 gap-2">
                  <h3 className="font-semibold">Afstand</h3>
                  <div className="flex flex-col justify-center gap-2 p-4 bg-surface-100 rounded-lg shadow-md font-semibold text-xl">
                    {activeRace?.distance} km
                    <span className="text-sm font-normal">
                      {activeRace?.distance !== undefined &&
                        (Number(activeRace.distance) < 120
                          ? 'Korte afstand'
                          : Number(activeRace.distance) < 180
                            ? 'Gemiddelde afstand'
                            : Number(activeRace.distance) < 220
                              ? 'Lange afstand'
                              : 'Zeer lange afstand')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <h3 className="font-semibold">Type Rit</h3>
                  <div className="flex flex-col justify-center gap-2 p-4  bg-surface-100 rounded-lg shadow-md font-semibold text-xl">
                    {ParcoursTypeKeyMap[
                      activeRace?.parcoursType as ParcoursType
                    ] ?? 'Niet beschikbaar'}
                    <span className="text-sm font-normal">
                      {activeStage?.parcoursType
                        ? parcoursDescriptions[
                            activeRace?.parcoursType as ParcoursType
                          ]
                        : 'Geen parcoursinformatie'}
                    </span>
                  </div>
                </div>
              </div>
              <div></div>
              <div style={container} className="h-full">
                Punten verdiend per speler
              </div>
            </div>
            <div className="flex flex-col flex-1/2 gap-10 w-full">
              <div className="py-[10px]"></div>
              <div className="flex flex-col flex-1 gap-2">
                <h3 className="font-semibold">Uitslag Race</h3>
                <div className="flex flex-col gap-2 p-4 bg-surface-100 rounded-lg shadow-md font-semibold text-xl h-full overflow-auto">
                  <DataTable
                    paginator
                    rows={5}
                    loading={resultLoading}
                    value={raceResultsState}
                    dataKey="id"
                    sortField="ranking"
                    sortOrder={1}
                    emptyMessage="Geen resultaten gevonden"
                  >
                    <Column field="position" header="Plaats" />
                    <Column field="name" header="Naam" />
                    <Column field="time" header="Tijd" />
                  </DataTable>
                </div>
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
