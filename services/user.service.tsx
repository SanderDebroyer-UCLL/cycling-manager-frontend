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

export const getLoggedInUser = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/auth/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    // throw the error message so it triggers rejected action
    throw new Error(data.error || 'Er is iets misgegaan.');
  }

  return data;
};

const UserService = {
  getUsers,
};

export default UserService;
