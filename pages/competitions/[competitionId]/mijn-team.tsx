import { useRouter } from 'next/router';
import React from 'react';

const index = () => {
  const router = useRouter();
  const { competitionId } = router.query;
  return <div>mijn team</div>;
};

export default index;
