import Chip from '@/components/chip';
import CompetitieLayout from '@/components/layout/competitieLayout';
import { container } from '@/const/containerStyle';
import { ResultType } from '@/const/resultType';
import { Column } from 'primereact/column';
import { Mountain, Star, Trophy, UserIcon, Users } from 'lucide-react';
import React, { ReactNode, use, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { StageResult } from '@/types/race';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchLastResultsByType } from '@/features/stage-results/stage-results.slice';
import { CompetitionDTO } from '@/types/competition';
import TimeBodyTemplate from '@/components/template/TimeBodyTemplate';
import TotalPointsChipBodyTemplate from '@/components/template/TotalPointsChipBodyTemplate';
import { fetchStagePointsForCompetitionId } from '@/features/points/points.slice';
import { UserTeamDTO } from '@/types/user-team';
import { fetchUserTeam } from '@/features/user-teams/user-teams.slice';

const klassement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [resultStatus, setResultStatus] = useState<ResultType>(ResultType.GC);
  const [competitionResults, setCompetitionResults] = useState<boolean>(true);
  const pointsPerUser = useSelector((state: RootState) => state.points.points);
  const pointsPerUserStatus = useSelector(
    (state: RootState) => state.points.status,
  );

  const competition: CompetitionDTO = useSelector(
    (state: any) => state.competition.competitionDTO,
  );
  const userTeamsStatus = useSelector(
    (state: RootState) => state.userTeams.status,
  );
  const userTeams: UserTeamDTO[] = useSelector(
    (state: any) => state.userTeams.data,
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

  const [hasFetched1, setHasFetched1] = useState(false);
  const [hasFetched2, setHasFetched2] = useState(false);

  useEffect(() => {
    if (!competition) return;
    const raceId = competition.races[0].id;
    if ((stageResultsStatus === 'idle' && raceId) || (!hasFetched1 && raceId)) {
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

      setHasFetched1(true);
    }
  }, [dispatch, stageResultsStatus, competition]);
  useEffect(() => {
    if (!competition) return;
    if (
      userTeams.length === 0 ||
      !userTeams ||
      userTeamsStatus === 'idle' ||
      !hasFetched2
    ) {
      dispatch(fetchUserTeam());
      setHasFetched2(true);
    }
  }, [competition, userTeamsStatus, dispatch, userTeams.length, hasFetched2]);

  useEffect(() => {
    if (!competition) return;
    if (pointsPerUser.length === 0 || pointsPerUserStatus === 'idle') {
      dispatch(fetchStagePointsForCompetitionId(competition.id));
    }
  }, [pointsPerUserStatus, competition, dispatch]);

  return (
    <div className="flex flex-col gap-10 ">
      <h2 className="text-xl font-bold flex gap-4 items-center">
        Overzicht klassementen
      </h2>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <Chip
            label="Competitie"
            Icon={Trophy}
            active={competitionResults}
            onClick={() => setCompetitionResults(true)}
            variant={'primary'}
          />
          <Chip
            label="Teams"
            Icon={Users}
            active={!competitionResults}
            onClick={() => setCompetitionResults(false)}
            variant={'primary'}
          />
        </div>
        <div style={container} className="flex flex-col overflow-auto">
          {competitionResults ? (
            <>
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
            </>
          ) : (
            <DataTable
              loading={pointsPerUserStatus === 'loading'}
              value={pointsPerUser}
              emptyMessage="Geen punten gevonden"
              sortField="points"
              sortOrder={-1}
            >
              <Column field="fullName" header="Naam" />
              <Column
                field="points"
                header="Points"
                body={TotalPointsChipBodyTemplate(competition)} // ← call it here!
              />
            </DataTable>
          )}
        </div>
      </div>

      {!competitionResults && (
        <div className="flex gap-8 overflow-x-auto max-w-[calc(100vw-350px-2rem)]">
          {userTeams
            .filter((userTeam) => userTeam.competitionId === competition.id)
            .map((userTeam) => {
              const uniqueAssignmentsMap: Record<
                number,
                (typeof userTeam.cyclistAssignments)[number]
              > = {};

              userTeam.cyclistAssignments.forEach((assignment) => {
                const id = assignment.cyclist.id;
                if (!uniqueAssignmentsMap[id]) {
                  uniqueAssignmentsMap[id] = assignment;
                }
              });

              const uniqueAssignments = Object.values(uniqueAssignmentsMap);

              return (
                <div
                  style={container}
                  key={userTeam.id}
                  className="flex flex-col gap-4 shrink-0 w-full max-w-[calc(50%-16px)] min-w-[400px]"
                >
                  <h3 className="text-lg font-semibold">{userTeam.name}</h3>
                  <DataTable
                    value={uniqueAssignments}
                    emptyMessage="Geen gebruikers gevonden"
                    sortField="totalPoints"
                    sortOrder={-1}
                  >
                    <Column field="cyclist.name" header="Naam" />
                    <Column field="cyclist.team.name" header="Team" />
                  </DataTable>
                </div>
              );
            })}
        </div>
      )}
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
