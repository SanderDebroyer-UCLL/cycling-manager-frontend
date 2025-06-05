import { CompetitionStatus } from '@/types/competition';

export const createCompetition = async (competitionData: any) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/competitions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
    },
    body: JSON.stringify(competitionData),
  });

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

export const getCompetition = async (competitionId: number) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/competitions/' + competitionId,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
    },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch competition');
  }

  return res.json();
};

export const getCompetitionResultsUpdate = async (competitionId: number) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/competitions/results/' + competitionId,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
    },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch competition results update');
  }

  return res.json();
};

export const scrapeCompetitionStages = async (competitionId: number) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/competitions/scrape/' + competitionId,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
    },
  );

  if (!res.ok) {
    throw new Error('Failed to scrape competition stages');
  }

  return res.json();
};

export const scrapeAllCompetitionResults = async () => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/competitions/results/all',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
    },
  );

  if (!res.ok) {
    throw new Error('Failed to scrape all competition results');
  }

  return res.json();
};

export const updateCompetitionStatusPut = async (
  competitionId: number,
  competitionStatus: CompetitionStatus,
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      '/competitions/' +
      competitionId +
      '?status=' +
      competitionStatus,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
      body: JSON.stringify(competitionStatus),
    },
  );

  if (!res.ok) {
    throw new Error('Failed to update competition status');
  }

  return res.json();
};

const CompetitionService = {
  createCompetition,
  getCompetitions,
  scrapeCompetitionStages,
};

export default CompetitionService;
