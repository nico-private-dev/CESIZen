import { IUser } from './user';

export interface IAuthResponse {
  result: IUser;
  token: string;
}

export interface IAuthContextState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthContextProps extends IAuthContextState {
    register: (username: string, firstname: string, lastname: string, email: string, password: string, roleName: string) => Promise<void>;
    login: (login: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    updateUsername: (newUsername: string) => Promise<void>;
}

export interface PrivateRouteProps {
    children: React.ReactNode;
  }

  