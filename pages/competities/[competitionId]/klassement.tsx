'use client';

import React, { ReactNode, useState } from 'react';
import { users } from '@/const/data';
import { User } from '@/types/user';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import CompetitieLayout from '@/components/competitieLayout';
import { container } from '@/const/containerStyle';
import { ParcoursType, Stage } from '@/types/race';
import { ResultType } from '@/const/resultType';

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
      results: [
        {
          position: 1,
          rider: 'PEDERSEN Mads',
          team: 'Lidl - Trek',
          timeGap: '0:00',
          resultType: ResultType.STAGE,
          scrapeResultType: ResultType.STAGE
        },
        {
          position: 2,
          rider: 'ROGLIČ Primož',
          team: 'Red Bull - BORA - hansgrohe',
          timeGap: '0:17',
          resultType: ResultType.STAGE,
          scrapeResultType: ResultType.STAGE
        },
        {
          position: 3,
          rider: 'VACEK Mathias',
          team: 'Lidl - Trek',
          timeGap: '0:24',
          resultType: ResultType.STAGE,
          scrapeResultType: ResultType.STAGE
        },
        {
          position: 4,
          rider: 'MCNULTY Brandon',
          team: 'UAE Team Emirates - XRG',
          timeGap: '0:31',
          resultType: ResultType.STAGE,
          scrapeResultType: ResultType.STAGE
        },
        {
          position: 5,
          rider: 'DEL TORO Isaac',
          team: 'UAE Team Emirates - XRG',
          timeGap: '0:32',
          resultType: ResultType.STAGE,
          scrapeResultType: ResultType.STAGE
        },
      ],
      id: '',
      departure: '',
      arrival: '',
      startTime: '',
      verticalMeters: '',
      parcoursType: ParcoursType.FLAT
    },
    {
      name: 'Etappe 2',
      date: '2023-07-02',
      distance: '200 km',
      results: [
        {
          position: 6,
          rider: 'AYUSO Juan',
          team: 'UAE Team Emirates - XRG',
          timeGap: '0:35',
          resultType: ResultType.STAGE,
          scrapeResultType: ResultType.STAGE
        },
        {
          position: 7,
          rider: 'POOLE Max',
          team: 'Team Picnic PostNL',
          timeGap: '0:43',
          resultType: ResultType.STAGE,
          scrapeResultType: ResultType.STAGE
        },
        {
          position: 8,
          rider: 'TIBERI Antonio',
          team: 'Bahrain - Victorious',
          timeGap: '0:44',
          resultType: ResultType.STAGE,
          scrapeResultType: ResultType.STAGE
        },
        {
          position: 9,
          rider: 'STORER Michael',
          team: 'Tudor Pro Cycling Team',
          timeGap: '0:46',
          resultType: ResultType.STAGE,
          scrapeResultType: ResultType.STAGE
        },
        {
          position: 10,
          rider: 'PELLIZZARI Giulio',
          team: 'Red Bull - BORA - hansgrohe',
          timeGap: '0:50',
          resultType: ResultType.STAGE,
          scrapeResultType: ResultType.STAGE
        },
      ],
      id: '',
      departure: '',
      arrival: '',
      startTime: '',
      verticalMeters: '',
      parcoursType: ParcoursType.FLAT
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
          <h2 className="text-xl font-semibold mb-4">
            {selectedStage.name} Resultaten
          </h2>
          <div style={container} className="overflow-auto w-full max-h-[80vh]">
            <DataTable
              value={selectedStage.results}
              tableStyle={{ width: '100%' }}
            >
              <Column field="position" header="Positie" />
              <Column field="rider" header="Renner" />
              <Column field="team" header="Team" />
              <Column field="timeGap" header="Tijd achterstand" />
            </DataTable>
          </div>
        </>
      ) : (
        <p className="text-gray-500 mt-4">
          Selecteer een etappe om de resultaten te bekijken.
        </p>
      )}
    </main>
  );
};

LeaderboardWithSidebar.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default LeaderboardWithSidebar;
