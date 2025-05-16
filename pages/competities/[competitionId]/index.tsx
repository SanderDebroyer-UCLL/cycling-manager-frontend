import CompetitieLayout from '@/components/competitieLayout';
import { fetchCompetitionById } from '@/features/competition/competition.slice';
import { AppDispatch } from '@/store/store';
import { Competition } from '@/types/competition';
import { useRouter } from 'next/router';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const index = () => {
  const router = useRouter();
  const competition: Competition = useSelector(
    (state: any) => state.competition.data
  );
  const dispatch = useDispatch<AppDispatch>();
  const { competitionId } = router.query;

  useEffect(() => {
    if (
      competition &&
      competitionId &&
      competition.id.toString().trim() !== competitionId.toString().trim()
    ) {
      dispatch(fetchCompetitionById(competitionId.toString()));
    }
  }, [dispatch, competition, competitionId]);

  if (!competition) {
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

  return (
    <div className=" py-12 px-8 ">
      {competition.races[0].niveau.startsWith('2') && (
        <div className="flex">Ronde Race</div>
      )}
      <div className="flex flex-col">
        <h2></h2>
      </div>
    </div>
  );
};

index.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default index;
