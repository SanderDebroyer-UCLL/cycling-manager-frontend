export const scrapeTeams = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/teams/scrape', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Failed to scrape teams: ${data.message || res.statusText}`,
    );
  }
  return data;
};

const TeamsService = {
  scrapeTeams,
};

export default TeamsService;
