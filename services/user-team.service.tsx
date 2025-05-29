export const getAllUserTeams = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user-teams', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch race data');
  }

  return res.json();
};

export const updateUserTeamMainCyclists = async (
  mainCyclistIds: number[],
  reserveCyclistIds: number[],
  userTeamId: number,
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/user-teams/update/' + userTeamId,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
      body: JSON.stringify({ mainCyclistIds, reserveCyclistIds }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    // throw the error message so it triggers rejected action
    throw new Error(data.error || 'Er is iets misgegaan.');
  }

  return data;
};

const UserTeamService = {
  getAllUserTeams,
};

export default UserTeamService;
