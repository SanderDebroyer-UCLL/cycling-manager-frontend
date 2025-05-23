import { container } from '@/const/containerStyle';
import { Competition } from '@/types/competition';
import { UserTeam } from '@/types/user-team';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';

interface StartedPhaseProps {
  userTeams: UserTeam[];
  email: string | null;
  competition: Competition;
}

const StartedPhase: React.FC<StartedPhaseProps> = ({
  userTeams,
  email,
  competition,
}) => {
  useEffect(() => {
    console.log('userTeams', userTeams);
  });

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
              value={
                userTeams.find(
                  (team) =>
                    team.competitionId === competition.id &&
                    team.user.email === email,
                )?.cyclists
              }
            >
              <Column header="Naam" field="name" />
              <Column header="Team" field="team" />
              <Column header="Punten Verdiend" field="pointsScored" />
            </DataTable>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <h3 className="font-semibold">Reserve renners</h3>
          <div style={container} className="max-h-[70vh] overflow-y-auto">
            <DataTable
              value={
                userTeams.find(
                  (team) =>
                    team.competitionId === competition.id &&
                    team.user.email === email,
                )?.cyclists
              }
            >
              <Column header="Naam" field="name" />
              <Column header="Team" field="team" />
              <Column header="Punten Verdiend" field="pointsScored" />
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartedPhase;
