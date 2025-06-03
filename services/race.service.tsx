export const getAllRaces = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/races', {
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

export const scrapeRaces = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/races/scrape', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Failed to scrape races: ${data.message || res.statusText}`,
    );
  }
  return data;
};

export const reloadRaceData = async (name: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/races/scrapeSingleRace?name=${encodeURIComponent(name)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  const data = await res.json();
  return data;
};

const RaceService = {
  getAllRaces,
  reloadRaceData,
};

export default RaceService;
