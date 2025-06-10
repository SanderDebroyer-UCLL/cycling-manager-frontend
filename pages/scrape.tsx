import AnimatedContent from '@/components/AnimatedContent';
import Spacer from '@/components/Spacer';
import { container } from '@/const/containerStyle';
import { fetchScrapeAllCompetitionResults } from '@/features/competition/competition.slice';
import { fetchScrapeCyclists } from '@/features/cyclists/cyclists.slice';
import { fetchScrapeRaces } from '@/features/race/race.slice';
import { fetchScrapeStages } from '@/features/stages/stage.slice';
import { fetchScrapeTeams } from '@/features/teams/teams.slice';
import { AppDispatch } from '@/store/store';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { RadioButton } from 'primereact/radiobutton';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const scrape = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<String>('Race');

  return (
    <div className="p-20 flex flex-col gap-4 max-w-[80vw] mx-auto">
      <Dialog
        header="Punten Toevoegen"
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        className="md:w-20rem w-full max-w-[600px] top-5"
        position="top"
      >
        <div className="flex align-items-center">
          <RadioButton
            inputId="pointsType1"
            name="pointsType"
            value="Race"
            onChange={(e) => setType(e.value)}
            checked={type === 'Race'}
          />
          <label htmlFor="ingredient2" className="ml-2">
            Race
          </label>
        </div>
        <div className="flex align-items-center">
          <RadioButton
            inputId="pointsType2"
            name="pointsType"
            value="Stage"
            onChange={(e) => setType(e.value)}
            checked={type === 'Stage'}
          />
          <label htmlFor="ingredient3" className="ml-2">
            Stage
          </label>
        </div>
        <div className="flex gap-4 flex-col">
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="">Reden</label>
            <InputText value={''} />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="">Competitie</label>
            <Dropdown
              value={''}
              options={[]}
              optionLabel="Naam competitie"
              placeholder="Selecteer een competitie"
              className="w-full md:w-14rem"
            />
          </div>

          <div className="flex gap-8 justify-between">
            <Button
              label="Annuleer"
              onClick={() => setVisible(false)}
              outlined
            />
            <Button
              label="Creëer Competitie"
              // loading={competitionStatus === 'loading'}
              // onClick={handleCreateCompetition}
            />
          </div>
        </div>
      </Dialog>
      <div className="flex justify-between h-[28px] items-center">
        <AnimatedContent
          distance={15}
          direction="vertical"
          reverse={false}
          duration={0.7}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1}
          delay={0}
        >
          <h2 className="text-xl font-bold">Overzicht van alle scrapes</h2>
        </AnimatedContent>
        <AnimatedContent
          distance={0}
          direction="vertical"
          reverse={false}
          duration={0.7}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1}
          delay={0}
        >
          <Button label="Punten toevoegen" onClick={() => setVisible(true)} />
        </AnimatedContent>
      </div>
      <div className="flex gap-10 w-full">
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
                  <Button
                    label="Stages"
                    onClick={() => dispatch(fetchScrapeStages())}
                  />
                </div>
              </div>
              <h3 className="font-semibold text-xl">Resultaten</h3>
              <p className="font-medium text-lg">Competities</p>
              <div className="flex items-center justify-between gap-4 w-full">
                <p className="flex-2/3">
                  Alle resultaten van alle competities:
                </p>
                <div className="flex-1/3 w-full">
                  <Button
                    label="Resultaten"
                    onClick={() => dispatch(fetchScrapeAllCompetitionResults())}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={container} className="!p-10 rounded-xl max-w-[600px]">
          <h3 className="text-xl font-bold">Belangrijke Informatie</h3>
          <p>
            Volg de volgorde van de knoppen om de data correct op te halen.
            Begin steeds met het ophalen van Teams, gevolgd door Wielrenners,
            enzovoort.
          </p>
          <p>
            Raadpleeg de live backend-logs via Digital Ocean om te controleren
            of de scrapes correct zijn voltooid.
          </p>
          <p>
            Start geen meerdere scrapes tegelijkertijd om fouten en overmatige
            belasting van de server te voorkomen.
          </p>
          <p>
            Data wordt elke nacht automatisch opgehaald om 02:00 uur. Voer enkel
            handmatig een scrape uit als het echt noodzakelijk is.
          </p>
        </div>
      </div>
    </div>
  );
};

export default scrape;
