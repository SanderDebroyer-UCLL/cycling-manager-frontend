import CompetitieLayout from '@/components/competitieLayout';
import { container } from '@/const/containerStyle';
import { fetchCompetitionById } from '@/features/competition/competition.slice';
import {
  fetchRaceResultsByRaceId,
  resetRaceResultsStatus,
} from '@/features/race-results/race-results.slice';
import {
  fetchGCStageResult,
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
import { Calendar, Flag } from 'lucide-react';
import { useRouter } from 'next/router';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const index = () => {
  const router = useRouter();
  const { competitionId, itemId } = router.query;

  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  const [activeRace, setActiveRace] = useState<Race | null>(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [stageResultsState, setStageResultsState] = useState<StageResult[]>([]);
  const [stageGCResultsState, setStageGCResultsState] = useState<StageResult[]>(
    [],
  );
  const [raceResultsState, setRaceResultsState] = useState<RaceResult[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const competition: Competition = useSelector(
    (state: any) => state.competition.data,
  );
  const stageResults: StageResult[] = useSelector(
    (state: any) => state.stageResults.etappeResult,
  );
  const raceResults: RaceResult[] = useSelector(
    (state: any) => state.raceResults.data,
  );
  const stageResultsStatus: string = useSelector(
    (state: any) => state.stageResults.status,
  );
  const raceResultsStatus: string = useSelector(
    (state: any) => state.raceResults.status,
  );
  const stageGCResults: StageResult[] = useSelector(
    (state: any) => state.stageResults.gcResult,
  );

  useEffect(() => {
    setStageResultsState(stageResults);
  }, [stageResults]);

  useEffect(() => {
    setStageGCResultsState(stageGCResults);
    console.log('Stage GC Results:', stageGCResults);
  }, [stageGCResults]);

  useEffect(() => {
    setRaceResultsState(raceResults);
  }, [raceResults]);

  useEffect(() => {
    if (stageResultsStatus === 'idle' && activeStage?.id) {
      dispatch(fetchStageResultsByStageId(activeStage.id));
      dispatch(fetchGCStageResult(activeStage.id));
    }
  }, [dispatch, stageResultsStatus, activeStage?.id]);

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
    if (!competition || !itemId) return;

    // Try to find stage or race with this id:
    const stage = competition.races
      .flatMap((r) => r.stages)
      .find((s) => s.id.toString() === itemId);
    if (stage) {
      setActiveStage(stage);
      setActiveRace(null); // clear active race if needed
      return;
    }

    const race = competition.races.find((r) => r.id.toString() === itemId);
    if (race) {
      setActiveRace(race);
      setActiveStage(null);
      return;
    } else {
      if (competition.races[0].stages.length > 0) {
        router.replace(
          `/competities/${competitionId}/ritten/${competition.races[0].stages[0].id}`,
        );
      } else {
        router.replace(
          `/competities/${competitionId}/ritten/${competition.races[0].id}`,
        );
      }
    }
  }, [competition, itemId]);

  const onSelectStage = (stage: Stage) => {
    setActiveStage(stage);
    setActiveRace(null);
    dispatch(resetStageResultsStatus());
    router.push(`/competities/${competitionId}/ritten/${stage.id}`, undefined, {
      shallow: true,
    });
  };

  const onSelectRace = (race: Race) => {
    setActiveRace(race);
    setActiveStage(null);
    dispatch(resetRaceResultsStatus());
    router.push(`/competities/${competitionId}/ritten/${race.id}`, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (
      competition &&
      competitionId &&
      competition.id.toString().trim() !== competitionId.toString().trim()
    ) {
      dispatch(fetchCompetitionById(competitionId.toString()));
    }
  }, [dispatch, competition, competitionId]);

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
                    onSelectStage(stage);
                    dispatch(resetStageResultsStatus()); // reset before fetch effect can run
                  }}
                  key={stage.id}
                  style={container}
                  className={`cursor-pointer shrink-0 w-72 mb-4 rounded-lg p-4 border transition-all ${
                    stage.id.toString() === itemId
                      ? '!bg-primary-100 !border-primary-500 !text-primary-900'
                      : ''
                  }`}
                >
                  <p className="font-semibold text-lg flex items-center gap-2">
                    Stage {index + 1}
                  </p>
                  <p className="flex items-center gap-2">
                    <Flag className="w-4 h-4 shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap">
                      {stage.name.split('|')[1]}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
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
                    onSelectRace(race);
                    dispatch(resetRaceResultsStatus());
                  }}
                  key={race.id}
                  style={container}
                  className={`cursor-pointer shrink-0 w-72 mb-4 rounded-lg p-4 border transition-all ${
                    race.id.toString() === itemId
                      ? '!bg-primary-100 !border-primary-500 !text-primary-900'
                      : ''
                  }`}
                >
                  <p className="font-semibold text-lg flex items-center gap-2">
                    Race {index + 1}
                  </p>
                  <p className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    <span className="truncate overflow-hidden whitespace-nowrap">
                      {race.name}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(race.startDate).toLocaleDateString('nl')}
                  </p>
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
                  <div style={container} className="font-semibold text-xl">
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
                  <div style={container} className="font-semibold text-xl">
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
                  <div style={container} className="font-semibold text-xl">
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
                  <div style={container} className="font-semibold text-xl">
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
                <div
                  style={container}
                  className="flex flex-col h-full overflow-auto"
                >
                  <div className="flex gap-4">
                    <div className="flex-1 font-semibold flex items-center bg-primary-100 border-1 border-primary-500 text-primary-900 px-4 py-2 cursor-pointer rounded-lg">
                      Etappe
                    </div>
                    <div className="flex-1 font-semibold flex items-center bg-primary-100 border-1 border-primary-500 text-primary-900 px-4 py-2 cursor-pointer rounded-lg">
                      Algemeen klassement
                    </div>
                    <div className="flex-1 font-semibold flex items-center bg-primary-100 border-1 border-primary-500 text-primary-900 px-4 py-2 cursor-pointer rounded-lg">
                      Jongerenklassement
                    </div>
                    <div className="flex-1 font-semibold flex items-center bg-primary-100 border-1 border-primary-500 text-primary-900 px-4 py-2 cursor-pointer rounded-lg">
                      Puntenklassement
                    </div>
                    <div className="flex-1 font-semibold flex items-center bg-primary-100 border-1 border-primary-500 text-primary-900 px-4 py-2 cursor-pointer rounded-lg">
                      Bergklassement
                    </div>
                  </div>
                  <DataTable
                    paginator
                    rows={5}
                    loading={resultLoading}
                    value={stageResultsState}
                    dataKey="id"
                    sortField="ranking"
                    sortOrder={1}
                    emptyMessage="Geen resultaten gevonden"
                    className=""
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
                  <div style={container} className="font-semibold text-xl">
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
                <div
                  style={container}
                  className="flex flex-col h-full overflow-auto"
                >
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
                    <Column field="cyclistName" header="Naam" />
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
