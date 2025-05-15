export const getUsers = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return res.json();
};

const UserService = {
  getUsers,
};

export default UserService;
