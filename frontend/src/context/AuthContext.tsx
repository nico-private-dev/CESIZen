import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextProps } from '../types/auth';
import type { IUser } from '../types/user';
import axios from 'axios';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Configuration de axios
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true
});

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Configurer l'intercepteur à l'intérieur du composant pour avoir accès aux setters
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status !== 401 || originalRequest._retry) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          const response = await api.post('/auth/refresh');
          if (response.data?.result) {
            setUser(response.data.result);
            setIsAuthenticated(true);
            return api(originalRequest);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            return Promise.reject(error);
          }
        } catch (refreshError) {
          setUser(null);
          setIsAuthenticated(false);
          return Promise.reject(refreshError);
        }
      }
    );

    // Nettoyer l'intercepteur quand le composant est démonté
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  // Fonction pour vérifier l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/mon-compte');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          console.error('Auth check failed:', err);
        }
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction pour l'inscription
  const register = async (username: string, firstname: string, lastname: string, email: string, password: string, roleName: string) => {
    try {
      const response = await api.post('/auth/register', {
        username,
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
  const login = async (login: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        login,
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

  // Fonction pour se déconnecter
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Fonction pour mettre à jour le nom d'utilisateur
  const updateUsername = async (newUsername: string) => {
    try {
      const response = await api.put('/auth/update-username', {
        username: newUsername
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (user) {
        setUser({
          ...user,
          username: newUsername
        });
      }
      
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du nom d\'utilisateur');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, error, register, login, logout, updateUsername }}>
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