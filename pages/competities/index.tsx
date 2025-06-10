import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { RootState, AppDispatch } from '@/store/store';
import { fetchRace } from '@/features/race/race.slice';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TreeSelect, TreeSelectSelectionKeysType } from 'primereact/treeselect';
import { TreeNode } from 'primereact/treenode';
import {
  createTreeNodesFromRaces,
  findSelectedRaceData,
} from '@/utils/createRaceNodes';
import { MultiSelect } from 'primereact/multiselect';
import { User } from '@/types/user';
import { fetchUsers } from '@/features/users/users.slice';
import { InputText } from 'primereact/inputtext';
import { createCompetitionRequest } from '@/features/competition/competition.slice';
import {
  fetchCompetitions,
  resetCompetitionsStatus,
} from '@/features/competitions/competitions.slice';
import { Race } from '@/types/race';
import LinkBodyTemplate from '@/components/template/LinkBodyTemplate';
import { container } from '@/const/containerStyle';
import { showErrorToast } from '@/services/toast.service';
import AnimatedContent from '@/components/AnimatedContent';
import { FloatLabel } from 'primereact/floatlabel';

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const races = useSelector((state: RootState) => state.race.data);
  const users = useSelector((state: RootState) => state.users.data);
  const raceStatus = useSelector((state: RootState) => state.race.status);
  const usersStatus = useSelector((state: RootState) => state.users.status);
  const competitionsStatus = useSelector(
    (state: RootState) => state.competitions.status,
  );
  const competitions = useSelector(
    (state: RootState) => state.competitions.data,
  );
  const competitionStatus = useSelector(
    (state: RootState) => state.competition.status,
  );
  const [name, setName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedRaces, setSelectedRaces] = useState<
    | string
    | TreeSelectSelectionKeysType
    | TreeSelectSelectionKeysType[]
    | null
    | undefined
  >(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [selectedRacesError, setSelectedRacesError] = useState<string | null>(
    null,
  );
  const [selectedUsersError, setSelectedUsersError] = useState<string | null>(
    null,
  );
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [visible, setVisible] = React.useState(false);
  const competitionError = useSelector(
    (state: RootState) => state.competition.error,
  );
  useEffect(() => {
    if (races.length) {
      const treeData = createTreeNodesFromRaces(races);
      setNodes(treeData);
    }
  }, [races]);

  useEffect(() => {
    if (raceStatus === 'idle') {
      dispatch(fetchRace());
    }
  }, [dispatch, raceStatus]);

  useEffect(() => {
    if (competitionsStatus === 'idle') {
      dispatch(fetchCompetitions());
    }
  }, [dispatch, competitionsStatus]);

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, usersStatus]);

  const handleCreateCompetition = () => {
    setNameError('');
    setSelectedRacesError('');
    setSelectedUsersError('');

    let hasError = false;

    if (!name.trim()) {
      setNameError('Naam is verplicht');
      hasError = true;
    }

    if (!selectedRaces || Object.keys(selectedRaces).length === 0) {
      setSelectedRacesError('Selecteer ten minste 1 race');
      hasError = true;
    }

    if (!selectedUsers || selectedUsers.length === 0) {
      setSelectedUsersError('Selecteer ten minste 1 deelnemer');
      hasError = true;
    }

    if (hasError) return;

    const usersEmail = selectedUsers.map((user) => user.email);
    const selectedKeys =
      selectedRaces && typeof selectedRaces === 'object'
        ? Object.keys(selectedRaces)
        : [];
    const selectedNodes = findSelectedRaceData(selectedKeys, nodes);
    const selectedRaceIds = selectedNodes.map((node) => Number(node.key));

    dispatch(
      createCompetitionRequest({
        name,
        userEmails: usersEmail,
        raceIds: selectedRaceIds,
      }),
    );
  };

  useEffect(() => {
    if (competitionStatus === 'succeeded') {
      setVisible(false);
      setName('');
      setSelectedRaces(null);
      setSelectedUsers([]);
      dispatch(resetCompetitionsStatus());
    } else if (competitionStatus === 'failed') {
      showErrorToast({
        summary: 'Competitie aanmaken mislukt',
        detail: competitionError || 'Er is iets misgegaan.',
      });
    }
  }, [competitionStatus, dispatch]);

  return (
    <>
      <div className="p-20 flex flex-col gap-4 max-w-[80vw] mx-auto">
        <div className="flex justify-between items-center  h-[28px]">
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
            <h2 className="text-xl font-semibold">Actieve Competities</h2>
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
            <Button
              label="Creëer Competitie"
              onClick={() => setVisible(true)}
            />
          </AnimatedContent>
        </div>
        <div
          style={container}
          className="overflow-hidden overflow-y-auto rounded-xl max-h-[75vh] w-full"
        >
          <DataTable
            value={competitions.filter(
              (competition) => competition.competitionStatus !== 'FINISHED',
            )}
            loading={competitionsStatus === 'loading'}
            tableStyle={{ width: '100%' }}
            sortField="name"
            sortOrder={1}
            emptyMessage="Geen competities gevonden"
          >
            <Column header="Naam" field="name" />

            <Column
              header="Wedstrijden"
              body={(rowData) =>
                rowData.races.map((race: Race) => race.name).join(', ')
              }
            />
            <Column header="Link" body={LinkBodyTemplate} />
          </DataTable>
        </div>
      </div>

      <Dialog
        header="Creëer Competitie"
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        className="md:w-20rem w-full max-w-[600px] top-5"
        position="top"
      >
        <div className="flex gap-8 py-6 px-2 flex-col">
          <div className="flex flex-col w-full gap-2">
            <FloatLabel className="w-full md:w-20rem">
              <InputText
                value={name}
                id="name"
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
              <label htmlFor="name">Naam</label>
              {nameError && (
                <div className="text-error text-sm mt-2">{nameError}</div>
              )}
            </FloatLabel>
          </div>
          <div className="flex flex-col w-full gap-2">
            <FloatLabel className="w-full md:w-20rem">
              <TreeSelect
                filter
                value={selectedRaces}
                showClear
                inputId="treeselect"
                onChange={(e) => {
                  const newValue =
                    e.value as TreeSelectSelectionKeysType | null;

                  // If nothing selected (deselected all)
                  if (!newValue || Object.keys(newValue).length === 0) {
                    setSelectedRaces(null);
                    return;
                  }

                  const newKeys = Object.keys(newValue);
                  const oldKeys = selectedRaces
                    ? Object.keys(selectedRaces)
                    : [];

                  // Detect added key (in new but not old)
                  const addedKey = newKeys.find(
                    (key) => !oldKeys.includes(key),
                  );
                  // Detect removed key (in old but not new)
                  const removedKey = oldKeys.find(
                    (key) => !newKeys.includes(key),
                  );

                  const oldSelectedNodes = findSelectedRaceData(oldKeys, nodes);
                  const addedNode = addedKey
                    ? findSelectedRaceData([addedKey], nodes)[0]
                    : null;

                  const oldHasNiveau2 = oldSelectedNodes.some((node) =>
                    node.data?.niveau?.startsWith('2'),
                  );

                  const addedIsNiveau2 =
                    addedNode?.data?.niveau?.startsWith('2');

                  if (removedKey) {
                    // User deselected something
                    // Just update selection to newValue as is, no forcing
                    setSelectedRaces(newValue);
                    return;
                  }

                  if (oldHasNiveau2) {
                    if (addedIsNiveau2) {
                      // Switching niveau 2 race: keep only that
                      setSelectedRaces({ [addedKey!]: true });
                    } else {
                      // Trying to add non-niveau 2 while niveau 2 selected -> ignore, keep old
                      setSelectedRaces(
                        oldKeys.reduce(
                          (acc, key) => ({ ...acc, [key]: true }),
                          {},
                        ),
                      );
                    }
                  } else {
                    if (addedIsNiveau2) {
                      // New niveau 2 selected: force single select
                      setSelectedRaces({ [addedKey!]: true });
                    } else {
                      // Normal multi-select
                      setSelectedRaces(newValue);
                    }
                  }
                }}
                options={nodes}
                className="md:w-20rem w-full"
                selectionMode="multiple"
                unselectable="on"
              ></TreeSelect>
              <label htmlFor="treeselect">Selecteer races</label>
            </FloatLabel>
            {selectedRacesError && (
              <div className="text-error text-sm mt-2">
                {selectedRacesError}
              </div>
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            <FloatLabel className="w-full md:w-20rem">
              <MultiSelect
                value={selectedUsers}
                onChange={(e) => setSelectedUsers(e.value)}
                options={users}
                optionLabel="firstName"
                className="w-full md:w-20rem"
              />
              <label htmlFor="users">Deelnemers</label>
              {selectedUsersError && (
                <div className="text-error text-sm mt-2">
                  {selectedUsersError}
                </div>
              )}
            </FloatLabel>
          </div>

          <div className="flex gap-8 justify-between">
            <Button
              label="Annuleer"
              onClick={() => setVisible(false)}
              outlined
            />
            <Button
              label="Creëer Competitie"
              loading={competitionStatus === 'loading'}
              onClick={handleCreateCompetition}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default Index;
