import Spacer from '@/components/Spacer';
import { container } from '@/const/containerStyle';
import { fetchScrapeCyclists } from '@/features/cyclists/cyclists.slice';
import { fetchScrapeRaces } from '@/features/race/race.slice';
import { fetchScrapeTeams } from '@/features/teams/teams.slice';
import { AppDispatch } from '@/store/store';
import { Button } from 'primereact/button';
import React from 'react';
import { useDispatch } from 'react-redux';

const scrape = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="p-10 flex flex-col gap-8">
      <div className="flex items-center">
        <h2 className="text-xl font-bold">Overzicht van alle scrapes</h2>
      </div>
      <div style={container} className="!p-10 rounded-xl">
        <div className="flex gap-8">
          {/* First Column */}
          <div className="flex flex-col flex-1 max-h-[75vh] gap-4">
            <h3 className="font-semibold text-xl">Teams</h3>
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="flex-2/3">Alle Teams scrapen:</p>
              <div className="flex-1/3 w-full">
                <Button
                  label="Teams"
                  onClick={() => dispatch(fetchScrapeTeams())}
                />
              </div>
            </div>
            <h3 className="font-semibold text-xl">Wielrenners</h3>
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="flex-2/3">Alle wielrenners scrapen:</p>
              <div className="flex-1/3 w-full">
                <Button
                  label="Wielrenners"
                  onClick={() => dispatch(fetchScrapeCyclists())}
                />
              </div>
            </div>
            <h3 className="font-semibold text-xl">Races</h3>
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="flex-2/3">Alle Races scrapen:</p>
              <div className="flex-1/3 w-full">
                <Button
                  label="Races"
                  onClick={() => dispatch(fetchScrapeRaces())}
                />
              </div>
            </div>

            <h3 className="font-semibold text-xl">Stages</h3>
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="flex-2/3">Alle Stages van gescrapete Races:</p>
              <div className="flex-1/3 w-full">
                <Button label="Stages" />
              </div>
            </div>
            <h3 className="font-semibold text-xl">Resultaten</h3>
            <p className="font-medium text-lg">Stages</p>
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="flex-2/3">Stage Resultaten (Algemeen):</p>
              <div className="flex-1/3 w-full">
                <Button label="Stage Results" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="flex-2/3">Stage Resultaten - Puntenklassement:</p>
              <div className="flex-1/3 w-full">
                <Button label="Stage Points" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="flex-2/3">Stage Resultaten - Bergklassement:</p>
              <div className="flex-1/3 w-full">
                <Button label="Stage KOM" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="flex-2/3">
                Stage Resultaten - Algemeen Klassement:
              </p>
              <div className="flex-1/3 w-full">
                <Button label="Stage GC" />
              </div>
            </div>
            <Spacer />
          </div>

          {/* Vertical Separator */}
          <div className="w-[2px] bg-outline" />

          {/* Second Column (currently empty, fill in as needed) */}
          <div className="flex flex-col flex-1 w-full">
            <p className="font-medium text-lg">Race</p>
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="flex-2/3">Race Resultaten:</p>
              <Button label="Race Results" />
            </div>

            <h3 className="font-semibold text-xl">Resultaten</h3>
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="flex-2/3">Competitiegegevens scrapen:</p>
              <Button label="Competitions" />
            </div>
          </div>
          <div className="w-[2px] bg-outline" />

          <div className="flex flex-col flex-1 w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default scrape;
