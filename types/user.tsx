export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  score?: number;
  profilePicture?: string;
  jwtToken?: string;
}


export interface RegisterUserDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginUserDetails {
  email: string;
  password: string;
}