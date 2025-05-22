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

const reloadRaceData = async (name: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/races/scrapeSingleRace?name=${encodeURIComponent(name)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();
    console.log("Scraped race:", data);
    return data;
  } catch (error) {
    console.error("Error while scraping race:", error);
  }
};


const RaceService = {
  getAllRaces,
  reloadRaceData,
};

export default RaceService;
