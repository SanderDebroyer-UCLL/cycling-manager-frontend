export const getAllRaces = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/race", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch race data');
  }

  return res.json();
};



const RaceService = {
  getAllRaces
};

export default RaceService;