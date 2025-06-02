import Chip from '@/components/chip';
import CompetitieLayout from '@/components/competitieLayout';
import SelectableCard from '@/components/SelectableCard';
import { container } from '@/const/containerStyle';
import { ResultType } from '@/const/resultType';
import {
  fetchCompetitionById,
  fetchCompetitionResultsUpdate,
  resetCompetitionStatus,
} from '@/features/competition/competition.slice';
import {
  fetchRaceResultsByRaceId,
  resetRaceResultsStatus,
} from '@/features/race-results/race-results.slice';
import {
  fetchRacePointsForRace,
  fetchStagePointsForStage,
  resetPointsStatus,
} from '@/features/points/points.slice';
import {
  fetchResultsByStageIdByType,
  resetStageResultsStatus,
} from '@/features/stage-results/stage-results.slice';
import { AppDispatch } from '@/store/store';
import { CompetitionDTO } from '@/types/competition';
import {
  ParcoursType,
  Race,
  RaceDTO,
  Stage,
  StageDTO,
  StageResult,
} from '@/types/race';
import { RaceResult } from '@/types/race-result';
import { Points } from '@/types/points';
import {
  parcoursDescriptions,
  ParcoursTypeKeyMap,
} from '@/utils/parcours-key-map';
import {
  FlagIcon,
  Mountain,
  RefreshCw,
  Star,
  Trophy,
  UserIcon,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PointsChipBodyTemplate from '@/components/PointsChipBodyTemplate';

const index = () => {
  const router = useRouter();
  const { competitionId, itemId } = router.query;

  const [activeStage, setActiveStage] = useState<StageDTO | null>(null);
  const [activeRace, setActiveRace] = useState<RaceDTO | null>(null);
  const [competitionLoading, setCompetitionLoading] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState<ResultType>(
    ResultType.STAGE,
  );
  const [stageResultsState, setStageResultsState] = useState<StageResult[]>([]);
  const [stageGCResultsState, setStageGCResultsState] = useState<StageResult[]>(
    [],
  );
  const [raceResultsState, setRaceResultsState] = useState<RaceResult[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const competitionStatus: string = useSelector(
    (state: any) => state.competition.status,
  );
  const competition: CompetitionDTO | null = useSelector(
    (state: any) => state.competition.competitionDTO,
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
  const pointsStatus: string = useSelector((state: any) => state.points.status);
  const stageGCResults: StageResult[] = useSelector(
    (state: any) => state.stageResults.gcResult,
  );
  const points: Points[] = useSelector((state: any) => state.points.points);

  useEffect(() => {
    if (competitionStatus === 'loading') {
      setCompetitionLoading(true);
    } else {
      setCompetitionLoading(false);
    }
  }, [competitionStatus]);

  useEffect(() => {
    setStageResultsState(stageResults);
  }, [stageResults]);

  useEffect(() => {
    setStageGCResultsState(stageGCResults);
  }, [stageGCResults]);

  useEffect(() => {
    setRaceResultsState(raceResults);
  }, [raceResults]);

  useEffect(() => {
    if (!competition || !competitionId) return;
    if (pointsStatus === 'idle') {
      if (activeStage) {
        dispatch(
          fetchStagePointsForStage({
            competitionId: competition?.id,
            stageId: activeStage.id,
          }),
        );
      } else if (activeRace) {
        dispatch(
          fetchRacePointsForRace({
            competitionId: competition?.id,
            raceId: activeRace.id,
          }),
        );
      }
    }
  }, [
    dispatch,
    pointsStatus,
    competition?.id,
    competitionId,
    activeStage?.id,
    activeRace?.id,
  ]);

  useEffect(() => {
    if (stageResultsStatus === 'idle' && activeStage?.id) {
      dispatch(
        fetchResultsByStageIdByType({
          stageId: activeStage.id,
          resultType: ResultType.STAGE,
        }),
      );
      dispatch(
        fetchResultsByStageIdByType({
          stageId: activeStage.id,
          resultType: ResultType.GC,
        }),
      );
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
    if (competitionStatus === 'succeeded') {
      if (activeStage?.id) {
        dispatch(
          fetchResultsByStageIdByType({
            stageId: activeStage.id,
            resultType: ResultType.STAGE,
          }),
        );
        dispatch(
          fetchResultsByStageIdByType({
            stageId: activeStage.id,
            resultType: ResultType.GC,
          }),
        );
      }
      if (!activeRace) return;
      dispatch(fetchRaceResultsByRaceId(activeRace.id));
      dispatch(resetCompetitionStatus());
    }
  }, [competitionStatus]);

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

  useEffect(() => {
    if (
      competition &&
      competitionId &&
      competition.id.toString().trim() !== competitionId.toString().trim()
    ) {
      dispatch(
        fetchCompetitionById(
          Number(
            Array.isArray(competitionId) ? competitionId[0] : competitionId,
          ),
        ),
      );
    }
  }, [dispatch, competition, competitionId]);

  const onSelectStage = (stage: StageDTO) => {
    setActiveStage(stage);
    setActiveRace(null);
    dispatch(resetStageResultsStatus());
    dispatch(resetPointsStatus());
    router.push(`/competities/${competitionId}/ritten/${stage.id}`, undefined, {
      shallow: true,
    });
  };

  const onSelectRace = (race: RaceDTO) => {
    setActiveRace(race);
    setActiveStage(null);
    dispatch(resetRaceResultsStatus());
    dispatch(resetPointsStatus());
    router.push(`/competities/${competitionId}/ritten/${race.id}`, undefined, {
      shallow: true,
    });
  };

  if (!competition) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-surface z-9999">
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
      <div className="flex flex-col gap-10 w-full">
        <div className="flex flex-col gap-6">
          <h2 className=" text-xl font-bold flex gap-4 items-center">
            Ritten{' '}
            {competition.races[0].stages.length > 0
              ? competition.races[0].name
              : competition.name}
            <Button
              raised
              icon={() => (
                <RefreshCw size={16} className="h-4 w-4 stroke-[2.5]" />
              )}
              tooltip="Haal de laatste resultaten en punten op"
              tooltipOptions={{ showDelay: 500 }}
              aria-label="Haal de laatste data op"
              className="!p-0 h-[48px] w-[48px] flex items-center justify-center"
              loading={competitionLoading}
              onClick={() =>
                dispatch(fetchCompetitionResultsUpdate(competition.id))
              }
            />
          </h2>
        </div>

        <div className="flex gap-8 w-full overflow-x-auto">
          {competition.races[0].stages.length > 0
            ? competition.races[0].stages.map((stage, index) => {
                const [day, month] = stage.date.split('/').map(Number);
                const year = new Date(
                  competition.races[0].startDate,
                ).getFullYear();
                const fullDate = new Date(year, month - 1, day);
                const dateStr = fullDate.toLocaleDateString('nl');

                return (
                  <SelectableCard
                    key={stage.id}
                    title={`Stage ${index + 1}`}
                    subtitle={stage.name.split('|')[1]}
                    date={dateStr}
                    selected={stage.id.toString() === itemId}
                    onClick={() => {
                      onSelectStage(stage);
                      dispatch(resetStageResultsStatus());
                    }}
                  />
                );
              })
            : competition.races.map((race, index) => (
                <SelectableCard
                  key={race.id}
                  title={`Race ${index + 1}`}
                  subtitle={race.name}
                  date={new Date(race.startDate).toLocaleDateString('nl')}
                  selected={race.id.toString() === itemId}
                  onClick={() => {
                    onSelectRace(race);
                    dispatch(resetRaceResultsStatus());
                  }}
                />
              ))}
        </div>

        {competition.races[0].stages.length > 0 ? (
          <div className="flex gap-10 w-full ">
            <div className="flex flex-1/2 flex-col gap-5">
              <h3 className="font-semibold">Overzicht {activeStage?.name} </h3>
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
              <div className="flex flex-col flex-1 gap-2">
                <h3 className="font-semibold">Punten verdiend per deelnemer</h3>
                <div
                  style={container}
                  className="flex flex-col h-full overflow-auto"
                >
                  <DataTable
                    value={points}
                    dataKey="userId"
                    sortField="position"
                    sortOrder={1}
                    emptyMessage="Geen resultaten gevonden"
                    className=""
                  >
                    <Column field="fullName" header="Deelnemer" />
                    <Column
                      field="points"
                      header="Punten"
                      body={PointsChipBodyTemplate}
                    />
                  </DataTable>
                </div>
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
                    <Chip
                      label="Etappe"
                      Icon={FlagIcon}
                      active={resultStatus === ResultType.STAGE}
                      onClick={() => setResultStatus(ResultType.STAGE)}
                    />
                    <Chip
                      label="GC"
                      Icon={Trophy}
                      active={resultStatus === ResultType.GC}
                      onClick={() => setResultStatus(ResultType.GC)}
                    />
                    <Chip
                      label="Youth"
                      Icon={UserIcon}
                      active={resultStatus === ResultType.YOUNG}
                      onClick={() => setResultStatus(ResultType.YOUNG)}
                    />
                    <Chip
                      label="Points"
                      Icon={Star}
                      active={resultStatus === ResultType.POINTS}
                      onClick={() => setResultStatus(ResultType.POINTS)}
                    />
                    <Chip
                      label="Mountain"
                      Icon={Mountain}
                      active={resultStatus === ResultType.MOUNTAIN}
                      onClick={() => setResultStatus(ResultType.MOUNTAIN)}
                    />
                  </div>
                  <DataTable
                    paginator
                    rows={5}
                    loading={resultLoading}
                    value={
                      resultStatus === ResultType.STAGE
                        ? stageResultsState
                        : resultStatus === ResultType.GC
                          ? stageGCResultsState
                          : []
                    }
                    dataKey="id"
                    sortField="position"
                    sortOrder={1}
                    emptyMessage="Geen resultaten gevonden"
                    className=""
                  >
                    <Column field="position" header="Plaats" />
                    <Column field="cyclistName" header="Naam" />
                    {resultStatus === ResultType.STAGE ? (
                      <Column field="time" header="Tijd" />
                    ) : resultStatus === ResultType.GC ? (
                      <Column field="time" header="Tijd" />
                    ) : (
                      []
                    )}
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-10 w-full">
            <div className="flex flex-1/2 flex-col gap-5">
              <h3 className="font-semibold text-lg">
                Overzicht {activeRace?.name}
              </h3>
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
                  <div style={container} className="font-semibold text-xl">
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
              <div className="flex flex-col flex-1 gap-2">
                <h3 className="font-semibold">Punten verdiend per deelnemer</h3>
                <div
                  style={container}
                  className="flex flex-col h-full overflow-auto max-h-[300px]"
                >
                  <DataTable
                    value={points}
                    dataKey="userId"
                    sortField="position"
                    sortOrder={1}
                    emptyMessage="Geen resultaten gevonden"
                    className=""
                  >
                    <Column field="fullName" header="Deelnemer" />
                    <Column
                      field="points"
                      header="Punten"
                      body={PointsChipBodyTemplate}
                    />
                  </DataTable>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-1/2 gap-10 w-full">
              <div className="py-[10px]"></div>
              <div className="flex flex-col flex-1 gap-2">
                <h3 className="font-semibold">Uitslag Race</h3>
                <div
                  style={container}
                  className="flex flex-col h-full overflow-auto max-h-[500px]"
                >
                  <DataTable
                    paginator
                    rows={5}
                    loading={resultLoading}
                    value={raceResultsState}
                    dataKey="id"
                    sortField="position"
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
