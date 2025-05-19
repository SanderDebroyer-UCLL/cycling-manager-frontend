import React, { use, useEffect, useState } from 'react';
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
import { Competition } from '@/types/competition';
import Link from 'next/link';
import { Race } from '@/types/race';
import LinkBodyTemplate from '@/components/LinkBodyTemplate';

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const races = useSelector((state: RootState) => state.race.data);
  const users = useSelector((state: RootState) => state.users.data);
  const raceStatus = useSelector((state: RootState) => state.race.status);
  const usersStatus = useSelector((state: RootState) => state.users.status);
  const competitionsStatus = useSelector(
    (state: RootState) => state.competitions.status
  );
  const competitions = useSelector(
    (state: RootState) => state.competitions.data
  );
  const competitionStatus = useSelector(
    (state: RootState) => state.competition.status
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
    null
  );
  const [selectedUsersError, setSelectedUsersError] = useState<string | null>(
    null
  );
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    if (competitionStatus === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [competitionStatus]);

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
      })
    );
  };

  useEffect(() => {
    if (competitionStatus === 'succeeded') {
      setVisible(false);
      setName('');
      setSelectedRaces(null);
      setSelectedUsers([]);
      dispatch(resetCompetitionsStatus());
    }
  }, [competitionStatus, dispatch]);

  return (
    <>
      <div className="p-10 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Actieve competities</h2>
          <Button label="Creëer Competite" onClick={() => setVisible(true)} />
        </div>
        <div className="overflow-hidden overflow-y-auto rounded-lg max-h-[75vh]">
          <DataTable value={competitions} tableStyle={{ width: '100%' }}>
            <Column
              header="Positie"
              body={(rowData, { rowIndex }) => rowIndex + 1}
            />
            <Column header="Naam" field="name" />
            <Column
              header="Races"
              body={(rowData) =>
                rowData.races.map((race: Race) => race.name).join(', ')
              }
            />
            <Column header="Link" body={LinkBodyTemplate} />
          </DataTable>
        </div>
      </div>

      <Dialog
        header="Creëer Competite"
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        className="md:w-20rem w-full max-w-[600px] top-5"
        position="top"
      >
        <div className="flex gap-4 flex-col">
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="">Naam</label>
            <InputText value={name} onChange={(e) => setName(e.target.value)} />
            {nameError && (
              <div className="text-red-500 text-sm mt-2">{nameError}</div>
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="">Race(s)</label>
            <TreeSelect
              filter
              value={selectedRaces}
              showClear
              onChange={(e) => {
                const newValue = e.value as TreeSelectSelectionKeysType | null;

                // If nothing selected (deselected all)
                if (!newValue || Object.keys(newValue).length === 0) {
                  setSelectedRaces(null);
                  return;
                }

                const newKeys = Object.keys(newValue);
                const oldKeys = selectedRaces ? Object.keys(selectedRaces) : [];

                // Detect added key (in new but not old)
                const addedKey = newKeys.find((key) => !oldKeys.includes(key));
                // Detect removed key (in old but not new)
                const removedKey = oldKeys.find(
                  (key) => !newKeys.includes(key)
                );

                const oldSelectedNodes = findSelectedRaceData(oldKeys, nodes);
                const addedNode = addedKey
                  ? findSelectedRaceData([addedKey], nodes)[0]
                  : null;

                const oldHasNiveau2 = oldSelectedNodes.some((node) =>
                  node.data?.niveau?.startsWith('2')
                );

                const addedIsNiveau2 = addedNode?.data?.niveau?.startsWith('2');

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
                        {}
                      )
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
              placeholder="Selecteer race(s)"
              selectionMode="multiple"
              unselectable="on"
            ></TreeSelect>
            {selectedRacesError && (
              <div className="text-red-500 text-sm mt-2">
                {selectedRacesError}
              </div>
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="">Deelnemers</label>
            <MultiSelect
              value={selectedUsers}
              options={users}
              onChange={(e) => setSelectedUsers(e.value)}
              itemTemplate={(user: User) =>
                `${user.firstName} ${user.lastName}`
              }
              selectedItemTemplate={(user: User | undefined) =>
                user ? `${user.firstName} ${user.lastName}` : ''
              }
              placeholder="Selecteer deelnemers"
              className="w-full md:w-20rem"
              display="chip"
            />
            {selectedUsersError && (
              <div className="text-red-500 text-sm mt-2">
                {selectedUsersError}
              </div>
            )}
          </div>

          <div className="flex gap-8 justify-between">
            <Button
              label="Annuleer"
              onClick={() => setVisible(false)}
              outlined
            />
            <Button
              label="Creëer Competite"
              loading={loading}
              onClick={handleCreateCompetition}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default Index;
