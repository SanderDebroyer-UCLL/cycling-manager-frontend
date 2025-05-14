export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  score: number;
  profilePicture: string;
}
