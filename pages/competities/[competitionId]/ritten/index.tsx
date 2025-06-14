import CompetitieLayout from '@/components/layout/competitieLayout';
import LoadingOverlay from '@/components/LoadingOverlay';
import { fetchCompetitionById } from '@/features/competition/competition.slice';
import { AppDispatch } from '@/store/store';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function RittenIndex() {
  const router = useRouter();
  const { competitionId } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  const competition = useSelector(
    (state: any) => state.competition.competitionDTO,
  );

  useEffect(() => {
    if (
      competition &&
      competitionId &&
      competition.id.toString().trim() !== competitionId.toString().trim()
    ) {
      dispatch(
        fetchCompetitionById(
          Number(
            Array.isArray(competitionId) ? competitionId[0] : competitionId,
          ),
        ),
      );
    }
  }, [dispatch, competition, competitionId]);

  useEffect(() => {
    if (!competition) return;

    let firstItemId = null;
    if (competition.races.length > 0) {
      if (competition.races[0].stages?.length > 0) {
        firstItemId = competition.races[0].stages[0].id;
      } else {
        firstItemId = competition.races[0].id;
      }
    }

    if (firstItemId) {
      router.replace(`/competities/${competitionId}/ritten/${firstItemId}`);
    }
  }, [competition, competitionId, router]);

  return <LoadingOverlay />;
}

RittenIndex.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);
