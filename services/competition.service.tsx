export const createCompetition = async (competitionData: any) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/api/competitions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
      body: JSON.stringify(competitionData),
    },
  );

  if (!res.ok) {
    throw new Error('Failed to create competition');
  }

  return res.json();
};

const CompetitionService = {
  createCompetition,
};

export default CompetitionService;
