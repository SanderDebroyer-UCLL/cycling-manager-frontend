import CompetitieLayout from '@/components/competitieLayout';
import { container } from '@/const/containerStyle';
import { fetchCompetitionById } from '@/features/competition/competition.slice';
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

  // Update state when competition stats change
  useEffect(() => {
    setTotalDistance(competitionStats.distance);
    setTotalElevation(competitionStats.elevation);
    setDates(competitionStats.dateRange);
  }, [competitionStats]);

  // Handle race status loading state
  useEffect(() => {
    setUpdateRaceDataLoading(raceStatus === 'loading');
  }, [raceStatus]);

  // Fetch cyclists with DNS when needed
  useEffect(() => {
    if (!cyclistWithDNS || userTeamsState === 'idle') {
      if (competitionIdNumber) {
        dispatch(fetchCyclistsWithDNS(competitionIdNumber));
      }
    }
  }, [dispatch, competitionIdNumber, cyclistWithDNS, userTeamsState]);

  // Fetch competition data when ID changes or doesn't match current competition
  useEffect(() => {
    if (
      competitionIdNumber &&
      (!competition || competition.id !== competitionIdNumber)
    ) {
      dispatch(fetchCompetitionById(competitionIdNumber));
    }
  }, [dispatch, competition, competitionIdNumber]);

  if (!competition) {
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
        <h2 className=" text-xl font-bold flex gap-4 items-center">
          Overzicht{' '}
          {competition.races[0].stages.length > 0
            ? competition.races[0].name
            : competition.name}
          <Button
            raised
            icon={() => (
              <RefreshCw size={16} className="h-4 w-4 stroke-[2.5]" />
            )}
            tooltip="Haal de laatste data op"
            tooltipOptions={{ showDelay: 500 }}
            aria-label="Haal de laatste data op"
            className="!p-0 h-[48px] w-[48px] flex items-center justify-center"
            loading={updateRaceDataLoading}
            onClick={() =>
              competition.races[0].stages.length > 0
                ? dispatch(updateRaceData(competition.races[0].name))
                : competition.races.forEach((race: RaceDTO) =>
                    dispatch(updateRaceData(race.name)),
                  )
            }
          />
        </h2>
      </div>
      <div className="flex gap-10 w-full">
        <div className="flex flex-1/4 flex-col gap-2 max-h-[500px]">
          <h3 className="font-semibold">Duur Competitie</h3>
          <Calendar value={dates} inline selectionMode="range" />
        </div>
        <div className="flex flex-row flex-3/4 gap-10 w-full max-h-[500px]">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Totale afstand</h3>
              <div
                style={container}
                className="flex flex-col justify-center gap-2 p-4  bg-surface rounded-xl font-semibold text-xl"
              >
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
              <div
                style={container}
                className="flex flex-col justify-center gap-2 p-4  bg-surface rounded-xl font-semibold text-xl"
              >
                {totalElevation} m
                <span className="text-sm font-normal">
                  Dat is {(totalElevation / 1.82).toFixed(0)} keer Niels
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Ritten</h3>
            <div
              style={container}
              className="flex flex-col h-full overflow-auto"
            >
              <DataTable
                selectionMode="single"
                selection={null}
                onSelectionChange={(e) =>
                  router.push(
                    `/competities/${competitionId}/ritten/${e.value.id}`,
                  )
                }
                value={
                  competition.races[0].stages.length > 0
                    ? competition.races[0].stages
                    : competition.races
                }
                tableStyle={{ width: '100%' }}
                emptyMessage="Geen ritten gevonden"
              >
                <Column header="Naam" field="name" />
                <Column header="Afstand" field="distance" />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
      <div style={container} className="flex flex-row gap-4 h-full w-full">
        <DataTable
          value={cyclistWithDNS}
          emptyMessage="Geen actieve renners die zijn gestopt"
        >
          <Column field="name" header="Naam" />
          <Column field="team.name" header="Team" />
          <Column field="dnsReason" header="Reden" />
        </DataTable>
      </div>
    </div>
  );
};

index.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default index;
