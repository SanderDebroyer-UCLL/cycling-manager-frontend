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
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRaceData } from '@/features/race/race.slice';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Race, RaceDTO } from '@/types/race';
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
    if (raceStatus === 'loading') {
      setUpdateRaceDataLoading(true);
    } else {
      setUpdateRaceDataLoading(false);
    }
  }, [raceStatus]);

  useEffect(() => {
    if (cyclistWithDNS.length === 0 || userTeamsState === 'idle') {
      if (!competitionId) return;
      dispatch(
        fetchCyclistsWithDNS(
          Number(
            Array.isArray(competitionId) ? competitionId[0] : competitionId,
          ),
        ),
      );
    }
  }, [dispatch, competitionId]);

  useEffect(() => {
    if (
      competition &&
      competitionId &&
      competition.id !==
        Number(Array.isArray(competitionId) ? competitionId[0] : competitionId)
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
              >
                <Column header="Naam" field="name" />
                <Column header="Afstand" field="distance" />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
      <div style={container} className="flex flex-row gap-4 h-full w-full">
        <DataTable value={cyclistWithDNS}>
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
