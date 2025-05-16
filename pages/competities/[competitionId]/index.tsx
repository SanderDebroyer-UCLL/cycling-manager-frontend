import CompetitieLayout from '@/components/competitieLayout';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

const index = () => {
  const router = useRouter();
  const { competitionId } = router.query;
  return <div>{competitionId} Overzicht</div>;
};

index.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default index;
