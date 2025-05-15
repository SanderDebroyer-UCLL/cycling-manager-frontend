import { Credentials } from '@/types/credentials';
import { User } from '@/types/user';

export const loginUser = async (Credentials: Credentials) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Credentials),
  });

  if (!res.ok) {
    throw new Error('Failed to login user');
  }

  return res.json();
};

export const registerUser = async (userInfo: User) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/api/auth/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    },
  );

  if (!res.ok) {
    throw new Error('Failed to register user');
  }

  return res.json();
};

const AuthService = {
  loginUser,
  registerUser,
};

export default AuthService;
  