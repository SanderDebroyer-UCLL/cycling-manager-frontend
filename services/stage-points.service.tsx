export const getStagePointsForStage = async (
  competitionId: number,
  stageId: number,
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      '/stagePoints/' +
      competitionId +
      '?stageId=' +
      stageId,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch');
  }

  return data;
};

export const getStagePointsForAllStages = async (
  competitionId: number,
  userId: number,
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      '/stagePoints/all/' +
      competitionId +
      '?userId=' +
      userId,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch');
  }

  return data;
};

export const StagePointsService = {
  getStagePointsForStage,
};

export default StagePointsService;
