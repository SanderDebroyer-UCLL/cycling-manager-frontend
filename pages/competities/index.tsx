import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { RootState, AppDispatch } from '@/store/store';
import { fetchRace } from '@/features/race/race.slice';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const races = useSelector((state: RootState) => state.race.data);
  const status = useSelector((state: RootState) => state.race.status);

  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRace());
    }
  }, [dispatch, status]);

  return (
    <>
      <div className="p-10 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Actieve competities</h2>
          <Button label="Creëer Competite" onClick={() => setVisible(true)} />
        </div>
        <div className="overflow-hidden overflow-y-auto rounded-lg max-h-[80vh]">
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
        style={{ width: '50vw' }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Dialog>
    </>
  );
};

export default Index;
