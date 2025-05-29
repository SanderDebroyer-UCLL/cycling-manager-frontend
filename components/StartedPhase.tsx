import { container } from '@/const/containerStyle';
import { Competition } from '@/types/competition';
import { Cyclist } from '@/types/cyclist';
import { StagePoints, StagePointsPerCyclist } from '@/types/stage-points';
import { UserTeam } from '@/types/user-team';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';

interface StartedPhaseProps {
  stagePoints: StagePointsPerCyclist[] | StagePoints[];
  email: string | null;
  competition: Competition;
  userTeams: UserTeam[];
  cyclistDeactivateTemplate: (
    rowData: StagePointsPerCyclist,
  ) => React.ReactNode;
  activateCyclistTemplate: (rowData: Cyclist) => React.ReactNode;
  teamChanged: boolean;
  resetChanges: () => void;
}

const StartedPhase: React.FC<StartedPhaseProps> = ({
  stagePoints,
  email,
  competition,
  userTeams,
  cyclistDeactivateTemplate,
  activateCyclistTemplate,
  teamChanged,
  resetChanges,
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
            <DataTable value={stagePoints}>
              <Column header="Naam" field="cyclistName" />
              <Column header="Punten Verdiend" field="points" />
              <Column body={cyclistDeactivateTemplate} header="Acties" />
            </DataTable>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <h3 className="font-semibold">Reserve renners</h3>
          <div style={container} className="max-h-[70vh] overflow-y-auto">
            <DataTable
              key={Date.now()} // or another unique key that changes when needed
              value={
                userTeams.find(
                  (team) =>
                    team.competitionId === competition.id &&
                    team.user.email === email,
                )?.reserveCyclists
              }
            >
              <Column header="Naam" field="name" />
              <Column header="Team" field="team" />
              <Column header="Punten Verdiend" field="pointsScored" />
              <Column body={activateCyclistTemplate} header="Activeer" />
            </DataTable>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between">
        {teamChanged && (
          <>
            <Button label="Annuleer" raised onClick={() => resetChanges()} />
            <Button label="Update team" />
          </>
        )}
      </div>
    </div>
  );
};

export default StartedPhase;
