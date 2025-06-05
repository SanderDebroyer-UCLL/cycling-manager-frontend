import { container } from '@/const/containerStyle';
import { CompetitionDTO } from '@/types/competition';
import { MainReservePointsCyclist, PointsPerCyclist } from '@/types/points';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';

interface StartedPhaseProps {
  mainReservePointsCyclist: MainReservePointsCyclist | null;
  cyclistDeactivateTemplate: (rowData: PointsPerCyclist) => React.ReactNode;
  activateCyclistTemplate: (rowData: PointsPerCyclist) => React.ReactNode;
  teamChanged: boolean;
  resetChanges: () => void;
  handleSubmitTeamChanges: () => void;
  competition: CompetitionDTO;
  userTeamsLoading: boolean;
}

const StartedPhase: React.FC<StartedPhaseProps> = ({
  mainReservePointsCyclist,
  cyclistDeactivateTemplate,
  activateCyclistTemplate,
  teamChanged,
  resetChanges,
  handleSubmitTeamChanges,
  competition,
  userTeamsLoading,
}) => {
  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="flex flex-col gap-6">
        <h2 className=" text-xl font-bold">Mijn team</h2>
      </div>
      <div className="flex flex-row gap-10">
        <div className="flex flex-col flex-1 gap-2">
          <h3 className="font-semibold">Huidige Selectie</h3>
          <div style={container} className="max-h-[70vh] overflow-y-auto">
            <DataTable
              key={Date.now()}
              value={mainReservePointsCyclist?.mainCyclists}
            >
              <Column header="Naam" field="cyclistName" />
              <Column header="Punten Verdiend" field="points" />
              <Column body={cyclistDeactivateTemplate} header="Deactiveer" />
            </DataTable>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <h3 className="font-semibold">Reserve renners</h3>
          <div style={container} className="max-h-[70vh] overflow-y-auto">
            <DataTable
              key={Date.now()} // or another unique key that changes when needed
              value={mainReservePointsCyclist?.reserveCyclists}
            >
              <Column header="Naam" field="cyclistName" />
              <Column header="Punten Verdiend" field="points" />
              <Column body={activateCyclistTemplate} header="Activeer" />
            </DataTable>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between">
        {teamChanged && (
          <>
            <Button label="Annuleer" raised onClick={() => resetChanges()} />
            {mainReservePointsCyclist?.mainCyclists.length ===
              competition.maxMainCyclists && (
              <Button
                loading={userTeamsLoading}
                label="Update team"
                onClick={() => handleSubmitTeamChanges()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StartedPhase;
