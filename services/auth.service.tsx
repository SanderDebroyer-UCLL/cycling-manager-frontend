import { Credentials } from '@/types/credentials';
import { RegisterUserDetails } from '@/types/user';

export const loginUser = async (Credentials: Credentials) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    // throw the error message so it triggers rejected action
    throw new Error(data.error || 'Er is iets misgegaan.');
  }

  return data;
};

export const registerUser = async (userInfo: RegisterUserDetails) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/auth/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Er is iets misgegaan.');
  }

  return data;
};

const AuthService = {
  loginUser,
  registerUser,
};

export default AuthService;
