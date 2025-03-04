export interface IUser {
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