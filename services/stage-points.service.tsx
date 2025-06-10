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

export const getStagePointsForCompetitionId = async (competitionId: number) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/stagePoints/all/users/' + competitionId,
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

export const createStagePoints = async (params: {
  stageId: number;
  competitionId: number;
  value: number;
  reason: string;
}) => {
  const { stageId, competitionId, value, reason } = params;

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/stagePoints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
    },
    body: JSON.stringify({
      stageId,
      competitionId,
      value,
      reason,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error('Failed to create stage points');
  }

  return data;
};

export const StagePointsService = {
  getStagePointsForStage,
  getStagePointsForCompetitionId,
};

export default StagePointsService;
