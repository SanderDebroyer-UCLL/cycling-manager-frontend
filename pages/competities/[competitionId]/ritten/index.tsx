import CompetitieLayout from '@/components/competitieLayout';
import { fetchCompetitionById } from '@/features/competition/competition.slice';
import { AppDispatch } from '@/store/store';
import { useRouter } from 'next/router';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function RittenIndex() {
  const router = useRouter();
  const { competitionId } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  const competition = useSelector((state: any) => state.competition.data);

  useEffect(() => {
    if (
      competition &&
      competitionId &&
      competition.id.toString().trim() !== competitionId.toString().trim()
    ) {
      dispatch(fetchCompetitionById(competitionId.toString()));
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

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-surface-100 z-9999">
      <ProgressSpinner
        style={{ width: '100px', height: '100px' }}
        strokeWidth="8"
        className="stroke-primary-500"
        animationDuration=".5s"
      />
    </div>
  );
}

RittenIndex.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);
