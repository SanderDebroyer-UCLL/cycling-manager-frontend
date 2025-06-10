import AnimatedContent from '@/components/AnimatedContent';
import Spacer from '@/components/Spacer';
import { container } from '@/const/containerStyle';
import { fetchScrapeAllCompetitionResults } from '@/features/competition/competition.slice';
import { fetchCompetitions } from '@/features/competitions/competitions.slice';
import { fetchScrapeCyclists } from '@/features/cyclists/cyclists.slice';
import {
  postCreatePoints,
  resetCreatePointsStatus,
} from '@/features/points/points.slice';
import { fetchScrapeRaces } from '@/features/race/race.slice';
import { fetchScrapeStages } from '@/features/stages/stage.slice';
import { fetchScrapeTeams } from '@/features/teams/teams.slice';
import { showErrorToast, showSuccessToast } from '@/services/toast.service';
import { AppDispatch, RootState } from '@/store/store';
import { Competition } from '@/types/competition';
import { create } from 'domain';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const scrape = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<String>('Race');
  const [reason, setReason] = useState<string>('');
  const [stageId, setStageId] = useState<number | null>(null);
  const [raceId, setRaceId] = useState<number | null>(null);
  const [value, setValue] = useState<number | null>(null);

  const [errors, setErrors] = useState<{
    raceId?: string;
    stageId?: string;
    value?: string;
    reason?: string;
    competition?: string;
  }>({});

  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);

  const competitions = useSelector(
    (state: RootState) => state.competitions.data,
  );

  const competitionsStatus = useSelector(
    (state: RootState) => state.competitions.status,
  );

  const createPointsStatus = useSelector(
    (state: RootState) => state.points.createPointsStatus,
  );

  const createPointsError = useSelector(
    (state: RootState) => state.points.error,
  );

  useEffect(() => {
    if (competitionsStatus === 'idle') {
      dispatch(fetchCompetitions());
    }
  }, [dispatch, competitionsStatus]);

  const handleCreatePoints = () => {
    const newErrors: typeof errors = {};

    if (!selectedCompetition) {
      newErrors.competition = 'Competitie is verplicht.';
    }

    if (!value || value <= 0) {
      newErrors.value = 'Geef een geldige waarde (> 0) in.';
    }

    if (!reason.trim()) {
      newErrors.reason = 'Reden is verplicht.';
    }

    if (type === 'Stage') {
      if (!stageId) {
        newErrors.stageId = 'Stage ID is verplicht.';
      }
    }

    if (type === 'Race') {
      if (!raceId) {
        newErrors.raceId = 'Race ID is verplicht.';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // Don't dispatch if errors exist
    }

    if (type === 'Stage') {
      dispatch(
        postCreatePoints({
          type: 'Stage',
          stageId: stageId ?? undefined,
          competitionId: selectedCompetition!.id,
          value: value!,
          reason,
        }),
      );
    } else if (type === 'Race') {
      dispatch(
        postCreatePoints({
          type: 'Race',
          raceId: raceId ?? undefined,
          competitionId: selectedCompetition!.id,
          value: value!,
          reason,
        }),
      );
    }
  };

  useEffect(() => {
    if (createPointsStatus === 'succeeded') {
      setVisible(false);
      setRaceId(null);
      setStageId(null);
      setValue(null);
      setReason('');
      setSelectedCompetition(null);

      showSuccessToast({
        summary: 'Succesvol',
        detail: 'De punten zijn succesvol toegevoegd.',
      });
      dispatch(resetCreatePointsStatus());
    } else if (createPointsStatus === 'failed') {
      showErrorToast({
        summary: 'Fout',
        detail:
          createPointsError ??
          'Er is een fout opgetreden bij het aanmaken van de punten.',
        severity: 'error',
      });
      dispatch(resetCreatePointsStatus());
    }
  }, [createPointsStatus]);

  return (
    <div className="p-20 flex flex-col gap-4 max-w-[80vw] mx-auto">
      <Dialog
        header="Punten Toevoegen"
        visible={visible}
        onHide={() => {
          setVisible(false);
          setErrors({});
        }}
        className="md:w-20rem w-full max-w-[600px] top-5"
        position="top"
      >
        <div className="flex gap-7 flex-col">
          <div className="flex gap-8">
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
          </div>
          {type === 'Stage' ? (
            <div className="flex flex-col w-full gap-1">
              <FloatLabel>
                <InputNumber
                  inputId="dd-stage"
                  value={stageId}
                  onChange={(e) => setStageId(e.value)}
                  className="w-full"
                />
                <label htmlFor="dd-stage">Stage Id</label>
              </FloatLabel>
              {errors.stageId && (
                <small className="text-red-500">{errors.stageId}</small>
              )}
            </div>
          ) : (
            <div className="flex flex-col w-full gap-1">
              <FloatLabel>
                <InputNumber
                  inputId="dd-race"
                  value={raceId}
                  onChange={(e) => setRaceId(e.value)}
                  className="w-full"
                />
                <label htmlFor="dd-race">Race Id</label>
              </FloatLabel>
              {errors.raceId && (
                <small className="text-red-500">{errors.raceId}</small>
              )}
            </div>
          )}

          <div className="flex flex-col w-full gap-1">
            <FloatLabel>
              <InputNumber
                className="w-full"
                value={value}
                onChange={(e) => setValue(e.value)}
              />
              <label htmlFor="">Hoeveelheid</label>
            </FloatLabel>
            {errors.value && (
              <small className="text-red-500">{errors.value}</small>
            )}
          </div>

          <div className="flex flex-col w-full gap-1">
            <FloatLabel>
              <InputText
                className="w-full"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <label htmlFor="">Reden</label>
            </FloatLabel>
            {errors.reason && (
              <small className="text-red-500">{errors.reason}</small>
            )}
          </div>
          <div className="flex flex-col w-full gap-1">
            <FloatLabel>
              <Dropdown
                inputId="dd-competition"
                value={selectedCompetition}
                options={
                  type === 'Stage'
                    ? competitions.filter(
                        (competition) =>
                          competition.competitionStatus !== 'FINISHED' &&
                          competition.races[0].stages.length > 0,
                      )
                    : competitions.filter(
                        (competition) =>
                          competition.competitionStatus !== 'FINISHED' &&
                          competition.races[0].stages.length === 0,
                      )
                }
                onChange={(e) => setSelectedCompetition(e.value)}
                optionLabel="name"
                className="w-full"
              />
              <label htmlFor="dd-competition">Selecteer Competitie</label>
            </FloatLabel>
            {errors.competition && (
              <small className="text-red-500">{errors.competition}</small>
            )}
          </div>

          <div className="flex gap-8 justify-between">
            <Button
              label="Annuleer"
              onClick={() => setVisible(false)}
              outlined
            />
            <Button
              onClick={() => handleCreatePoints()}
              loading={createPointsStatus === 'loading'}
              label="Creëer Punten"
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
        <div style={container} className="!p-10 rounded-xl flex-2/5">
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
        <div style={container} className="!p-10 rounded-xl flex-3/5">
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
