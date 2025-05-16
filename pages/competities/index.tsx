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

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const races = useSelector((state: RootState) => state.race.data);
  const users = useSelector((state: RootState) => state.users.data);
  const raceStatus = useSelector((state: RootState) => state.race.status);
  const usersStatus = useSelector((state: RootState) => state.users.status);
  const competitionStatus = useSelector(
    (state: RootState) => state.competition.status,
  );
  const [name, setName] = useState('');
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [visible, setVisible] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRaces, setSelectedRaces] = useState<
    | string
    | TreeSelectSelectionKeysType
    | TreeSelectSelectionKeysType[]
    | null
    | undefined
  >(null);

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

  const handleCreateCompetition = async () => {
    if (!name) {
      return;
    }

    if (!selectedRaces) {
      return;
    }

    if (!selectedUsers) {
      return;
    }

    const usersEmail = selectedUsers.map((user) => user.email);

    const selectedRacesArray = Object.keys(selectedRaces);

    const selectedKeys = Object.keys(selectedRaces); // ["1", "2", "9"]
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

  return (
    <>
      <div className="p-10 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Actieve competities</h2>
          <Button label="Creëer Competite" onClick={() => setVisible(true)} />
        </div>
        <div className="overflow-hidden overflow-y-auto rounded-lg max-h-[75vh]">
          <DataTable value={races} tableStyle={{ width: '100%' }}>
            <Column
              header="Position"
              body={(rowData, { rowIndex }) => rowIndex + 1}
            />
            <Column header="Name" field="name" />
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
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="">Race(s)</label>
            <TreeSelect
              filter
              value={selectedRaces}
              onChange={(e) => setSelectedRaces(e.value)}
              options={nodes}
              className="md:w-20rem w-full"
              placeholder="Selecteer race(s)"
              selectionMode="multiple"
              unselectable="on"
            ></TreeSelect>
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="">Deelnemers</label>
            <MultiSelect
              value={selectedUsers}
              options={users}
              onChange={(e) => setSelectedUsers(e.value)}
              optionLabel="name"
              placeholder="Selecteer deelnemers"
              // itemTemplate={countryTemplate}
              className="w-full md:w-20rem"
              display="chip"
            />
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
