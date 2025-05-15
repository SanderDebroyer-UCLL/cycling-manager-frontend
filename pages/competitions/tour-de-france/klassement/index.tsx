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

  // Template voor naam + profielfoto
  const nameBodyTemplate = (user: User) => {
    return (
      <div className="flex items-center gap-2">
        <img
          src={user.profilePicture}
          alt={user.firstName}
          height={32}
          width={32}
          className="rounded-full"
        />
        <p>
          {user.firstName} {user.lastName}
        </p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10">
        <h2 className="text-xl font-semibold mb-4">Klassement</h2>
        <div className="rounded-lg shadow-md bg-surface-100 p-6 overflow-auto">
          <DataTable value={sortedUsers} tableStyle={{ width: '100%' }}>
            <Column
              header="Positie"
              body={(rowData, { rowIndex }) => rowIndex + 1}
            />
            <Column header="Naam" body={nameBodyTemplate} />
            <Column field="score" header="Score" />
          </DataTable>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardWithSidebar;
