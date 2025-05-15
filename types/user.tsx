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


export interface registerUserDetails {
  name: string;
  email: string;
  password: string;
}

export interface loginUserDetails {
  email: string;
  password: string;
}