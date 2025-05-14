import { Credentials } from '@/types/credentials';

export const loginUser = async (Credentials: Credentials) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Credentials),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user data');
  }

  return res.json();
};

const signupUser = (Credentials: Credentials) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + '/api/auth/create-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Credentials),
  });
};

const AuthService = {
  loginUser,
  signupUser,
};

export default AuthService;
