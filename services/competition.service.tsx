import { get } from 'http';

export const createCompetition = async (competitionData: any) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/competitions/create-competition',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
      body: JSON.stringify(competitionData),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to create competition');
  }

  return res.json();
};

export const getCompetitions = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/competitions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch competitions');
  }

  return res.json();
};

export const getCompetition = async (competitionId: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/competitions/' + competitionId,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch competition');
  }

  return res.json();
};

const CompetitionService = {
  createCompetition,
  getCompetitions,
};

export default CompetitionService;
