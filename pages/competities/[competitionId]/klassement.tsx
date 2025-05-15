'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { users } from '@/const/data';
import { User } from '@/types/user';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Stage } from '@/types/grandtour';

const LeaderboardWithSidebar = () => {
  // Sorteer gebruikers op score aflopend
  const sortedUsers = users.sort(
    (a: User, b: User) => (b.score ?? 0) - (a.score ?? 0),
  );

  const stages: Stage[] = [
    {
      name: 'Etappe 1',
      date: '2023-07-01',
      distance: '180 km',
      type: 'vlakke etappe',
      results: [
        {
          position: 1,
          rider: 'PEDERSEN Mads',
          team: 'Lidl - Trek',
          timeGap: '0:00',
        },
        {
          position: 2,
          rider: 'ROGLIČ Primož',
          team: 'Red Bull - BORA - hansgrohe',
          timeGap: '0:17',
        },
        {
          position: 3,
          rider: 'VACEK Mathias',
          team: 'Lidl - Trek',
          timeGap: '0:24',
        },
        {
          position: 4,
          rider: 'MCNULTY Brandon',
          team: 'UAE Team Emirates - XRG',
          timeGap: '0:31',
        },
        {
          position: 5,
          rider: 'DEL TORO Isaac',
          team: 'UAE Team Emirates - XRG',
          timeGap: '0:32',
        },
      ],
    },
    {
      name: 'Etappe 2',
      date: '2023-07-02',
      distance: '200 km',
      type: 'bergetappe',
      results: [
        {
          position: 6,
          rider: 'AYUSO Juan',
          team: 'UAE Team Emirates - XRG',
          timeGap: '0:35',
        },
        {
          position: 7,
          rider: 'POOLE Max',
          team: 'Team Picnic PostNL',
          timeGap: '0:43',
        },
        {
          position: 8,
          rider: 'TIBERI Antonio',
          team: 'Bahrain - Victorious',
          timeGap: '0:44',
        },
        {
          position: 9,
          rider: 'STORER Michael',
          team: 'Tudor Pro Cycling Team',
          timeGap: '0:46',
        },
        {
          position: 10,
          rider: 'PELLIZZARI Giulio',
          team: 'Red Bull - BORA - hansgrohe',
          timeGap: '0:50',
        },
      ],
    },
  ];

  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

  return (
      <main className="p-10 w-full">
        {/* Etappe Dropdown */}
        <div className="mb-4">
          <Dropdown
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.value)}
            options={stages}
            optionLabel="name"
            placeholder="Selecteer een etappe"
            className="w-full md:w-60"
          />
        </div>

        {/* Etapperesultaten */}
        {selectedStage ? (
          <>
            <h2 className="text-xl font-semibold mb-4">{selectedStage.name} Resultaten</h2>
            <div className="rounded-lg shadow-md bg-surface-100 overflow-auto w-full max-h-[80vh]">
              <DataTable value={selectedStage.results} tableStyle={{ width: '100%' }}>
                <Column field="position" header="Positie" />
                <Column field="rider" header="Renner" />
                <Column field="team" header="Team" />
                <Column field="timeGap" header="Tijd achterstand" />
              </DataTable>
            </div>
          </>
        ) : (
          <p className="text-gray-500 mt-4">Selecteer een etappe om de resultaten te bekijken.</p>
        )}
      </main>
  );
};

export default LeaderboardWithSidebar;
