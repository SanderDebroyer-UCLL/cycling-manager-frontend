import CompetitieLayout from '@/components/competitieLayout';
import { container } from '@/const/containerStyle';
import {
  fetchCompetitionById,
  fetchCompetitionStages,
} from '@/features/competition/competition.slice';
import { AppDispatch, RootState } from '@/store/store';
import { Competition, CompetitionDTO } from '@/types/competition';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Nullable } from 'primereact/ts-helpers';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRaceData } from '@/features/race/race.slice';
import LoadingOverlay from '@/components/LoadingOverlay';
import { RaceDTO } from '@/types/race';
import { RefreshCw } from 'lucide-react';
import { fetchCyclistsWithDNS } from '@/features/user-teams/user-teams.slice';
import TableChipBodyTemplate from '@/components/TableChipBodyTemplate';
import StageTypeChipBodyTemplate from '@/components/ParcoursTypeChipBodyTemplate';
import { getCompetitionStatusSubtext } from '@/utils/competition-status-map';
import DropOutReasonChipBodyTemplate from '@/components/DropOutReasonChipBodyTemplate';

const index = () => {
  const router = useRouter();
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalElevation, setTotalElevation] = useState(0);
  const [visible, setVisible] = useState(false);
  const [updateRaceDataLoading, setUpdateRaceDataLoading] = useState(false);

  const competition: CompetitionDTO | null = useSelector(
    (state: any) => state.competition.competitionDTO,
  );
  const competitionStatus = useSelector(
    (state: RootState) => state.competition.status,
  );
  const cyclistWithDNS = useSelector(
    (state: RootState) => state.userTeams.cyclistsWithDNS,
  );
  const userTeamsState = useSelector(
    (state: RootState) => state.userTeams.status,
  );
  const raceStatus = useSelector((state: RootState) => state.race.status);
  const dispatch = useDispatch<AppDispatch>();
  const { competitionId } = router.query;

  // Helper function to safely parse competitionId
  const getCompetitionIdAsNumber = useCallback(
    (id: string | string[] | undefined): number | null => {
      if (!id) return null;
      const idString = Array.isArray(id) ? id[0] : id;
      return Number(idString);
    },
    [],
  );

  const competitionIdNumber = useMemo(
    () => getCompetitionIdAsNumber(competitionId),
    [competitionId, getCompetitionIdAsNumber],
  );

  // Helper function to calculate totals from stages
  const calculateStageStats = useCallback((stages: any[]) => {
    const distance = stages.reduce(
      (total, stage) => total + Number(stage.distance || 0),
      0,
    );
    const elevation = stages.reduce(
      (total, stage) => total + Number(stage.verticalMeters || 0),
      0,
    );

    return {
      distance: Number(distance.toFixed(1)),
      elevation: Number(elevation.toFixed(1)),
    };
  }, []);

  // Helper function to calculate totals from races
  const calculateRaceStats = useCallback((races: any[]) => {
    const distance = races.reduce(
      (total, race) => total + Number(race.distance || 0),
      0,
    );
    // Fixed bug: was using race.distance for elevation calculation
    const elevation = races.reduce(
      (total, race) => total + Number(race.verticalMeters || 0),
      0,
    );

    return {
      distance: Number(distance.toFixed(1)),
      elevation: Number(elevation.toFixed(1)),
    };
  }, []);

  // Helper function to calculate date range
  const calculateDateRange = useCallback((races: any[]) => {
    if (!races.length) return null;

    const startDates = races.map((race) => new Date(race.startDate).getTime());
    const endDates = races.map((race) => new Date(race.endDate).getTime());

    const earliestStart = Math.min(...startDates);
    const latestEnd = Math.max(...endDates);

    return [new Date(earliestStart), new Date(latestEnd)];
  }, []);

  // Memoized calculations based on competition data
  const competitionStats = useMemo(() => {
    if (!competition?.races?.length) {
      return { distance: 0, elevation: 0, dateRange: null };
    }

    const hasStages = competition.races[0]?.stages?.length > 0;
    let stats;

    if (hasStages) {
      stats = calculateStageStats(competition.races[0].stages);
    } else {
      stats = calculateRaceStats(competition.races);
    }

    const dateRange = calculateDateRange(competition.races);

    return {
      distance: stats.distance,
      elevation: stats.elevation,
      dateRange,
    };
  }, [
    competition,
    calculateStageStats,
    calculateRaceStats,
    calculateDateRange,
  ]);

  // Memoize competition data structure to avoid repeated calculations
  const competitionData = useMemo(() => {
    if (!competition?.races?.length) {
      return {
        hasStages: false,
        displayName: '',
        items: [],
        itemCount: 0,
        itemType: 'wedstrijden',
      };
    }

    const firstRace = competition.races[0];
    const hasStages = firstRace?.stages?.length > 0;

    return {
      hasStages,
      displayName: hasStages ? firstRace.name : competition.name,
      items: hasStages ? firstRace.stages : competition.races,
      itemCount: hasStages ? firstRace.stages.length : competition.races.length,
      itemType: hasStages ? 'ritten' : 'wedstrijden',
    };
  }, [competition]);

  // Update state when competition stats change
  useEffect(() => {
    setTotalDistance(competitionStats.distance);
    setTotalElevation(competitionStats.elevation);
    setDates(competitionStats.dateRange);
  }, [competitionStats]);

  // Handle race status loading state
  useEffect(() => {
    if (raceStatus === 'loading' || competitionStatus === 'loading') {
      setUpdateRaceDataLoading(raceStatus === 'loading');
    }
  }, [raceStatus]);

  useEffect(() => {
    if (competitionIdNumber) {
      dispatch(fetchCyclistsWithDNS(competitionIdNumber));
    }
  }, [dispatch, competitionIdNumber]);

  // Fetch competition data when ID changes or doesn't match current competition
  useEffect(() => {
    if (
      competitionIdNumber &&
      (!competition || competition.id !== competitionIdNumber)
    ) {
      dispatch(fetchCompetitionById(competitionIdNumber));
    }
  }, [dispatch, competition, competitionIdNumber]);

  //TODO Startlijst ook ophalen
  const handleRefreshData = useCallback(() => {
    if (competitionData.hasStages && competition?.races?.length) {
      dispatch(fetchCompetitionStages(competition.id));
    } else if (competition?.races?.length) {
      if (competition.races[0].niveau.slice(0, 1) === '2') {
        dispatch(fetchCompetitionStages(competition.id));
      }
    }
  }, [competitionData.hasStages, competition, dispatch]);

  const handleStageSelection = useCallback(
    (selectedItem: any) => {
      router.push(`/competities/${competitionId}/ritten/${selectedItem.id}`);
    },
    [router, competitionId],
  );

  if (!competition || !competitionData || !cyclistWithDNS) {
    return <LoadingOverlay />;
  }

  return (
    <div className="flex flex-col gap-12 w-full">
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

      <div className="flex flex-col gap-10">
        <h2 className="text-xl font-bold flex gap-4 items-center">
          Overzicht {competitionData.displayName}
          <Button
            raised
            icon={() => (
              <RefreshCw size={16} className="h-4 w-4 stroke-[2.5]" />
            )}
            tooltip="Haal alle etappes en startlijsten op"
            tooltipOptions={{ showDelay: 500 }}
            className="!p-0 h-[48px] w-[48px] flex items-center justify-center"
            loading={updateRaceDataLoading}
            onClick={handleRefreshData}
          />
        </h2>
      </div>

      <div className="flex gap-10 w-full">
        <div className="flex flex-1/4 flex-col gap-2 max-h-[440px]">
          <h3 className="font-semibold">Duur Competitie</h3>
          <Calendar
            value={dates}
            inline
            selectionMode="range"
            className="h-full"
          />
        </div>

        <div className="flex flex-row flex-3/4 gap-10 w-full max-h-[440px]">
          <div className="flex flex-col justify-between gap-2 flex-1/3">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Totale afstand</h3>
              <div
                style={container}
                className="flex flex-col justify-center gap-2 font-semibold text-xl"
              >
                {totalDistance} km
                <span className="text-sm font-normal">
                  verdeeld over {competitionData.itemCount}{' '}
                  {competitionData.itemType}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">
                {competitionData.hasStages
                  ? 'Totaal hoogtemeters'
                  : 'Competitie Duur'}
              </h3>
              <div
                style={container}
                className="flex flex-col justify-center gap-2 font-semibold text-xl"
              >
                {competitionData.hasStages
                  ? `${totalElevation} m`
                  : `${Math.ceil(
                      (new Date(
                        [...(competitionData.items as RaceDTO[])].sort(
                          (a, b) =>
                            new Date(a.startDate).getTime() -
                            new Date(b.startDate).getTime(),
                        )[competitionData.items.length - 1].endDate,
                      ).getTime() -
                        new Date(
                          [...(competitionData.items as RaceDTO[])].sort(
                            (a, b) =>
                              new Date(a.startDate).getTime() -
                              new Date(b.startDate).getTime(),
                          )[0].startDate,
                        ).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )} dagen`}
                <span className="text-sm font-normal">
                  {competitionData.hasStages
                    ? `Dat is ${(totalElevation / 1.82).toFixed(0)} keer Niels`
                    : `Van eerste tot laatste koers`}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Competitie Status</h3>
              <div
                style={container}
                className="flex flex-col justify-center gap-2 font-semibold text-xl capitalize"
              >
                {competition.competitionStatus.toLocaleLowerCase()}
                <span className="text-sm font-normal normal-case">
                  {getCompetitionStatusSubtext(
                    competition.competitionStatus,
                  )}{' '}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-2/3">
            <h3 className="font-semibold">Ritten</h3>
            <div
              style={container}
              className="flex flex-col h-full overflow-auto"
            >
              <DataTable
                selectionMode="single"
                selection={null}
                onSelectionChange={(e) => handleStageSelection(e.value)}
                value={competitionData.items}
                tableStyle={{ width: '100%' }}
                emptyMessage="Geen ritten gevonden"
              >
                <Column header="Naam" field="name" />
                <Column header="Afstand" field="distance" />
                {competitionData.hasStages ? (
                  <Column
                    header="Type Parcours"
                    field="parcoursType"
                    body={StageTypeChipBodyTemplate}
                  />
                ) : (
                  <Column body={TableChipBodyTemplate} header="niveau" />
                )}
              </DataTable>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Renners die zijn uitgevallen</h3>
        <div style={container} className="flex flex-row gap-4 h-full w-full">
          <DataTable
            value={cyclistWithDNS}
            emptyMessage="Geen renners in teams die zijn uitgevallen"
          >
            <Column field="name" header="Naam" />
            <Column field="team.name" header="Team" />
            <Column header="Reden" body={DropOutReasonChipBodyTemplate} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

index.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default index;
