//Import
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextState, User } from '../types';
import axios from 'axios';

//Interface
interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps extends AuthContextState {
  register: (firstname: string, lastname: string, email: string, password: string, roleName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Configuration de axios
axios.defaults.withCredentials = true; 
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true
});

// Gestion du renouvellement automatique du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Initialisation du contexte
const AuthContext = createContext<AuthContextProps | undefined>(undefined);


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour vérifier l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/mon-compte');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction pour l'inscription
  const register = async (firstname: string, lastname: string, email: string, password: string, roleName: string) => {
    try {
      const response = await api.post('/auth/register', {
        firstname,
        lastname,
        email,
        password,
        roleName
      });
      setUser(response.data.result);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      throw err;
    }
  };

  // Fonction pour se connecter
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      setUser(response.data.result);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      throw err;
    }
  };

  // Fonction pour se déconnecter
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Fonction pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};