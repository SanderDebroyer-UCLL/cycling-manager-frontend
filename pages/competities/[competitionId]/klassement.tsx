import Chip from '@/components/chip';
import CompetitieLayout from '@/components/layout/competitieLayout';
import { container } from '@/const/containerStyle';
import { ResultType } from '@/const/resultType';
import { Column } from 'primereact/column';
import { Mountain, Star, Trophy, UserIcon } from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { StageResult } from '@/types/race';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import {
  fetchLastResultsByType,
  fetchResultsByStageIdByType,
} from '@/features/stage-results/stage-results.slice';
import { CompetitionDTO } from '@/types/competition';
import TimeBodyTemplate from '@/components/template/TimeBodyTemplate';

const klassement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [resultStatus, setResultStatus] = useState<ResultType>(ResultType.GC);

  const competition: CompetitionDTO = useSelector(
    (state: any) => state.competition.competitionDTO,
  );

  const stageYouthResults: StageResult[] = useSelector(
    (state: any) => state.stageResults.youthResult,
  );
  const stagePointsResults: StageResult[] = useSelector(
    (state: any) => state.stageResults.pointsResult,
  );
  const stageKOMResults: StageResult[] = useSelector(
    (state: any) => state.stageResults.komResult,
  );
  const stageResultsStatus: string = useSelector(
    (state: any) => state.stageResults.status,
  );
  const stageGCResults: StageResult[] = useSelector(
    (state: any) => state.stageResults.gcResult,
  );

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!competition) return;
    const raceId = competition.races[0].id;
    if ((stageResultsStatus === 'idle' && raceId) || (!hasFetched && raceId)) {
      dispatch(
        fetchLastResultsByType({
          raceId,
          resultType: ResultType.STAGE,
        }),
      );
      dispatch(
        fetchLastResultsByType({
          raceId,
          resultType: ResultType.GC,
        }),
      );
      dispatch(
        fetchLastResultsByType({
          raceId,
          resultType: ResultType.YOUTH,
        }),
      );
      dispatch(
        fetchLastResultsByType({
          raceId,
          resultType: ResultType.POINTS,
        }),
      );

      setHasFetched(true);
    }
  }, [dispatch, stageResultsStatus, competition]);

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
          loading={stageResultsStatus === 'loading'}
          value={
            resultStatus === ResultType.GC
              ? stageGCResults
              : resultStatus === ResultType.YOUTH
                ? stageYouthResults
                : resultStatus === ResultType.POINTS
                  ? stagePointsResults
                  : resultStatus === ResultType.MOUNTAIN
                    ? stageKOMResults
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
          {resultStatus === ResultType.STAGE ||
          resultStatus === ResultType.GC ||
          resultStatus === ResultType.YOUTH ? (
            <Column body={TimeBodyTemplate} header="Tijd" />
          ) : (
            <Column field="point" header="Punten" />
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
function useAppDispatch() {
  throw new Error('Function not implemented.');
}
