import { ResultType } from "@/const/resultType";

export const getResultsByStageIdByType = async (stageId: string, resultType: ResultType) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/stageResults/' + stageId + '?type=' + resultType,
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
  getResultsByStageIdByType,
  getRaceResultsByRaceId,
};

export default ResultsService;
