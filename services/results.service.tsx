export const getResultsByStageId = async (stageId: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/stageResults/result/' + stageId,
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

export const getGCStageResult = async (stageId: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/stageResults/gc/' + stageId,
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

export const getRaceResultsByRaceId = async (raceId: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/raceResults/race/' + raceId,
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

export const ResultsService = {
  getResultsByStageId,
  getRaceResultsByRaceId,
};

export default ResultsService;
