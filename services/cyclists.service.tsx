export const getAllCyclistss = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/cyclists', {
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


const CyclistService = {
  getAllCyclistss,
};

export default CyclistService;