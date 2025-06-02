export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  score?: number;
  profilePicture?: string;
  jwtToken?: string;
}

export interface JwtRes {
  jwtToken: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jwtToken: string;
  role: 'admin' | 'user';
  totalPoints: number;
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
