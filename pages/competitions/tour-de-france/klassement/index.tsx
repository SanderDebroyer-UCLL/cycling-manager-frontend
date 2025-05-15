import React from 'react';
import Sidebar from '@/components/sidebar';
import { users } from '@/const/data';
import { User } from '@/types/user';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { stageResults } from '@/const/data';
import { StageResult } from '@/types/grandtour';

const LeaderboardWithSidebar = () => {
// Sorteer gebruikers op score aflopend
  const sortedUsers = users.sort(
    (a: User, b: User) => (b.score ?? 0) - (a.score ?? 0),
  );

  return (
      <main className="p-10 w-full">
         {/* Etapperesultaten */}
        <h2 className="text-xl font-semibold mt-1 mb-4">Etappe Resultaten</h2>
        <div className="rounded-lg shadow-md bg-surface-100 overflow-auto w-full max-h-[80vh]">
          <DataTable value={stageResults} tableStyle={{ width: '100%' }}>
            <Column field="position" header="Positie" />
            <Column field="rider" header="Renner" />
            <Column field="team" header="Team" />
            <Column field="timeGap" header="Tijd achterstand" />
          </DataTable>
        </div>
      </main>
  );
};

export default LeaderboardWithSidebar;
