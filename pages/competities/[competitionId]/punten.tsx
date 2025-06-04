import CompetitieLayout from '@/components/layout/competitieLayout';
import LoadingOverlay from '@/components/LoadingOverlay';
import { container } from '@/const/containerStyle';
import {
  eindAlgemeen,
  eindJongeren,
  eindPunten,
  etappe,
  truien,
} from '@/const/puntenData';
import { CompetitionDTO } from '@/types/competition';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';

const punten = () => {
  const competition: CompetitionDTO | null = useSelector(
    (state: any) => state.competition.competitionDTO,
  );
  if (!competition) {
    return <LoadingOverlay />;
  }
  if (competition.races[0].stages.length === 0) {
    return (
      <div className="flex flex-col gap-10 w-full">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold flex gap-4 items-center">
            Punten overzicht
          </h2>
          <div className="flex gap-10">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg">Race</h3>
              <div
                style={container}
                className="flex flex-col h-full w-80 overflow-auto max-h-[75vh]"
              >
                <DataTable value={etappe}>
                  <Column field="position" header="Positie" />
                  <Column field="points" header="Punten" />
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-10 w-full">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold flex gap-4 items-center">
            Punten overzicht
          </h2>
          <div className="flex gap-10">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg">Etappe</h3>
              <p className="font-semibold text-lg">Resultaat</p>
              <div
                style={container}
                className="flex flex-col h-full overflow-auto max-h-[75vh]"
              >
                <DataTable value={etappe}>
                  <Column field="position" header="Positie" />
                  <Column field="points" header="Punten" />
                </DataTable>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg"> </h3>
              <p className="font-semibold text-lg">Bonuspunten</p>
              <div
                style={container}
                className="flex flex-coloverflow-auto max-h-[75vh]"
              >
                <DataTable value={truien}>
                  <Column field="classification" header="Positie" />
                  <Column field="extraPoints" header="Punten" />
                </DataTable>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg">Eindresultaat</h3>
              <p className="font-semibold text-lg">Algemeen</p>
              <div
                style={container}
                className="flex flex-col h-full overflow-auto max-h-[75vh]"
              >
                <DataTable value={eindAlgemeen}>
                  <Column field="position" header="Positie" />
                  <Column field="points" header="Punten" />
                </DataTable>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg"> </h3>
              <p className="font-semibold text-lg">Punten</p>
              <div
                style={container}
                className="flex flex-col h-full overflow-auto max-h-[75vh]"
              >
                <DataTable value={eindAlgemeen}>
                  <Column field="position" header="Positie" />
                  <Column field="points" header="Punten" />
                </DataTable>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg"> </h3>
              <p className="font-semibold text-lg">Berg</p>
              <div
                style={container}
                className="flex flex-col h-full overflow-auto max-h-[75vh]"
              >
                <DataTable value={eindPunten}>
                  <Column field="position" header="Positie" />
                  <Column field="points" header="Punten" />
                </DataTable>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg"> </h3>
              <p className="font-semibold text-lg">Jongeren</p>
              <div
                style={container}
                className="flex flex-col h-full overflow-auto max-h-[75vh]"
              >
                <DataTable value={eindJongeren}>
                  <Column field="position" header="Positie" />
                  <Column field="points" header="Punten" />
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

punten.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default punten;
