import {
  Competition,
  CompetitionPick,
  CompetitionStatus,
} from '@/types/competition';
import { Cyclist } from '@/types/cyclist';
import { User } from '@/types/user';
import { UserTeam } from '@/types/user-team';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import React, { ChangeEvent, useState } from 'react';

interface SelectingPhaseProps {
  competition: Competition;
  email: string | null;
  loading: boolean;
  cyclistsState: Cyclist[];
  userTeams: UserTeam[];
  setSelectedCyclist: (cyclist: Cyclist) => void;
  setConfirmTarget: (target: EventTarget & Element) => void;
  countryBodyTemplate: (rowData: any) => React.ReactNode;
  stompClientRef: React.RefObject<any>;
  container: React.CSSProperties;
  mainTeamPopupVisible: boolean;
  setMainTeamPopupVisible: (visible: boolean) => void;
}

const SelectingPhase: React.FC<SelectingPhaseProps> = ({
  competition,
  email,
  loading,
  cyclistsState,
  userTeams,
  setSelectedCyclist,
  setConfirmTarget,
  countryBodyTemplate,
  stompClientRef,
  container,
  mainTeamPopupVisible,
  setMainTeamPopupVisible,
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    country: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const onGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="flex flex-col gap-12 w-full">
      <Dialog
        header="Je hebt je hoofdteam compleet"
        visible={mainTeamPopupVisible}
        style={{ width: '400px' }}
        onHide={() => {
          if (!mainTeamPopupVisible) return;
          setMainTeamPopupVisible(false);
        }}
      >
        <p className="m-0">Vanaf nu kies je je reserverenners.</p>
      </Dialog>
      <div className="flex flex-col gap-6">
        <h2 className=" text-xl font-bold">Stel je team samen</h2>
      </div>
      <ConfirmPopup />
      <div style={container}>
        <DataTable
          header={header}
          paginator
          rows={5}
          selectionMode="single"
          onSelectionChange={(e) => {
            const userTeam = userTeams.find(
              (userTeam) =>
                userTeam.user.email.trim() === email?.trim() &&
                userTeam.competitionId === competition.id,
            );
            const isUserTurn = competition.competitionPicks.find(
              (competitionPick: CompetitionPick) =>
                competitionPick.userId === userTeam?.user.id &&
                competitionPick.pickOrder === competition.currentPick,
            );

            const teamNotFull =
              (userTeam?.mainCyclists.length || 0) +
                (userTeam?.reserveCyclists.length || 0) <
              competition.maxMainCyclists + competition.maxReserveCyclists;

            if (isUserTurn && teamNotFull) {
              setSelectedCyclist(e.value);
              setConfirmTarget(e.originalEvent.currentTarget); // Required for confirmPopup positioning
            }
          }}
          dataKey="id"
          filters={filters}
          loading={loading}
          globalFilterFields={['name', 'country', 'team']}
          emptyMessage="Geen renners gevonden."
          value={cyclistsState}
          tableStyle={{ width: '100%' }}
        >
          <Column header="Naam" field="name" />
          <Column
            header="Country"
            filterField="country.name"
            style={{ minWidth: '12rem' }}
            body={countryBodyTemplate}
          />
          <Column header="Ranking" field="ranking" />
        </DataTable>
      </div>
      <div className="flex gap-8 overflow-x-auto max-w-[calc(100vw-350px-2rem)]">
        {userTeams.length > 0 &&
          userTeams
            .filter(
              (userTeam: UserTeam) => userTeam.competitionId === competition.id,
            )
            .map((userTeam: UserTeam) => (
              <div
                key={userTeam.id}
                style={container}
                className={`flex-shrink-0 w-[300px] whitespace-nowrap overflow-hidden text-ellipsis ${
                  competition.competitionPicks.find(
                    (competitionPick: CompetitionPick) =>
                      competitionPick.userId == userTeam.user.id &&
                      competitionPick.pickOrder === competition.currentPick,
                  )
                    ? '!border-2 !border-primary-500'
                    : ''
                }`}
              >
                <h2 className="text-xl font-semibold overflow-hidden text-ellipsis">
                  {userTeam.user.email === email ? 'Mijn Team' : userTeam.name}
                </h2>
                <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-[350px] text-nowrap text-ellipsis">
                  {userTeam.mainCyclists.map((cyclist: Cyclist, index) => (
                    <div
                      key={cyclist.name}
                      className="flex items-center border-b-1 last:border-b-0 border-surface-400 mx-2 py-2"
                    >
                      <span className="mr-2">{index + 1}.</span>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap block w-full">
                        {cyclist.name}
                      </span>
                    </div>
                  ))}
                  {userTeam.reserveCyclists.map((cyclist: Cyclist, index) => (
                    <div
                      key={cyclist.name}
                      className="flex items-center border-b-1 last:border-b-0 border-surface-400 mx-2 py-2 text-surface-900"
                    >
                      <span className="mr-2">{index + 1}.</span>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap block w-full">
                        {cyclist.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
      </div>
      <div className="flex justify-between">
        <Button
          label="Terug"
          severity="secondary"
          outlined
          onClick={() =>
            stompClientRef.current?.publish({
              destination: '/app/status',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                status: CompetitionStatus.SORTING,
                competitionId: competition.id,
              }),
            })
          }
        />

        <Button
          label="Klaar"
          disabled={userTeams
            .filter(
              (userTeam: UserTeam) => userTeam.competitionId == competition.id,
            )
            .some(
              (userTeam) =>
                userTeam.mainCyclists.length + userTeam.reserveCyclists.length <
                competition.maxMainCyclists + competition.maxReserveCyclists,
            )}
          onClick={() =>
            stompClientRef.current?.publish({
              destination: '/app/status',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                status: CompetitionStatus.STARTED,
                competitionId: competition.id,
              }),
            })
          }
        />
      </div>
    </div>
  );
};

export default SelectingPhase;
