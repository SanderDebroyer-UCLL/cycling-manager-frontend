export const getRacePointsForRace = async (
  competitionId: number,
  raceId: number,
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      '/racePoints/' +
      competitionId +
      '?raceId=' +
      raceId,
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

export const getRacePointsForAllRaces = async (
  competitionId: number,
  userId: number,
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      '/racePoints/all/' +
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

export const getRacePointsForCompetitionId = async (competitionId: number) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/racePoints/all/users/' + competitionId,
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

export const createRacePoints = async ({
  raceId,
  competitionId,
  value,
  reason,
}: {
  raceId: number;
  competitionId: number;
  value: number;
  reason: string;
}) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/racePoints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
    },
    body: JSON.stringify({
      raceId,
      competitionId,
      value,
      reason,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error('Failed to create race points');
  }

  return data;
};

export const RacePointsService = {
  getRacePointsForRace,
  getRacePointsForCompetitionId,
};

export default RacePointsService;
