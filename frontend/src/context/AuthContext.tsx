import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextProps {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  register: (firstname: string, lastname: string, email: string, password: string, roleName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface RegisterResponse {
  result: any; // Vous pouvez remplacer 'any' par le type approprié pour l'utilisateur
  token: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5001/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (firstname: string, lastname: string, email: string, password: string, roleName: string) => {
    try {
      const response = await axios.post<RegisterResponse>('http://localhost:5001/api/auth/register', {
        firstname,
        lastname,
        email,
        password,
        roleName
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.result);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<RegisterResponse>('http://localhost:5001/api/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.result);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};