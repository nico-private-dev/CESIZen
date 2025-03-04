export interface User {
  _id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  isAdmin: boolean;
  role?: {
    name: string;
    permissions?: string[];
  };
}

export interface AuthResponse {
  result: User;
  token: string;
}

export interface AuthContextState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
 
 export interface Exercise {
   _id: string;
   title: string;
   description: string;
   difficulty: 'easy' | 'medium' | 'hard';
 }
 
 export interface Info {
   _id: string;
   title: string;
   content: string;
   createdAt: Date;
 }