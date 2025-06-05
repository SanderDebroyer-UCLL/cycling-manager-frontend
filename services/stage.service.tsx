export const scrapeStages = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/stages/scrape', {
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

const stageService = {
  scrapeStages,
};

export default stageService;
