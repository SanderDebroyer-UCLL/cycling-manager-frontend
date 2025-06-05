import Chip from '@/components/chip';
import CompetitieLayout from '@/components/layout/competitieLayout';
import { container } from '@/const/containerStyle';
import { ResultType } from '@/const/resultType';
import { Column } from 'primereact/column';
import {
  FlagIcon,
  Mountain,
  RefreshCw,
  Star,
  Trophy,
  UserIcon,
} from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { StageResult } from '@/types/race';
import { useSelector } from 'react-redux';

const klassement = () => {
  const [stageResultsState, setStageResultsState] = useState<StageResult[]>([]);
  const [stageGCResultsState, setStageGCResultsState] = useState<StageResult[]>(
    [],
  );
  const [resultStatus, setResultStatus] = useState<ResultType>(ResultType.GC);
  const stageResults: StageResult[] = useSelector(
    (state: any) => state.stageResults.etappeResult,
  );
  const stageGCResults: StageResult[] = useSelector(
    (state: any) => state.stageResults.gcResult,
  );

  useEffect(() => {
    setStageResultsState(stageResults);
  }, [stageResults]);

  useEffect(() => {
    setStageGCResultsState(stageGCResults);
  }, [stageGCResults]);

  return (
    <div className="flex flex-col gap-10 ">
      <h2 className="text-xl font-bold flex gap-4 items-center">
        Overzicht eindklassementen
      </h2>
      <div style={container} className="flex flex-col h-full overflow-auto">
        <div className="flex gap-4">
          <Chip
            label="GC"
            Icon={Trophy}
            active={resultStatus === ResultType.GC}
            onClick={() => setResultStatus(ResultType.GC)}
            variant={'secondary'}
          />
          <Chip
            label="Youth"
            Icon={UserIcon}
            active={resultStatus === ResultType.YOUTH}
            onClick={() => setResultStatus(ResultType.YOUTH)}
            variant={'secondary'}
          />
          <Chip
            label="Points"
            Icon={Star}
            active={resultStatus === ResultType.POINTS}
            onClick={() => setResultStatus(ResultType.POINTS)}
            variant={'secondary'}
          />
          <Chip
            label="Mountain"
            Icon={Mountain}
            active={resultStatus === ResultType.MOUNTAIN}
            onClick={() => setResultStatus(ResultType.MOUNTAIN)}
            variant={'secondary'}
          />
        </div>
        <DataTable
          paginator
          rows={5}
          value={
            resultStatus === ResultType.STAGE
              ? stageResultsState
              : resultStatus === ResultType.GC
                ? stageGCResultsState
                : []
          }
          dataKey="id"
          sortField="position"
          sortOrder={1}
          emptyMessage="Geen resultaten gevonden"
          className=""
        >
          <Column field="position" header="Plaats" />
          <Column field="cyclistName" header="Naam" />
          {resultStatus === ResultType.STAGE ? (
            <Column field="time" header="Tijd" />
          ) : resultStatus === ResultType.GC ? (
            <Column field="time" header="Tijd" />
          ) : (
            []
          )}
        </DataTable>
      </div>
    </div>
  );
};

klassement.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default klassement;
