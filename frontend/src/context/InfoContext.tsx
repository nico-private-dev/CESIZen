import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Info } from '../types';

interface InfoContextType {
  infos: Info[];
  loading: boolean;
  error: string | null;
  fetchInfos: () => Promise<void>;
  addInfo: (info: Omit<Info, '_id' | 'createdAt'>) => Promise<void>;
}

const InfoContext = createContext<InfoContextType | null>(null);

export const InfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [infos, setInfos] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfos = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/infos');
      setInfos(response.data as Info[]);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des informations');
    } finally {
      setLoading(false);
    }
  };

  const addInfo = async (info: Omit<Info, '_id' | 'createdAt'>) => {
    try {
      const response = await axios.post('http://localhost:5001/api/infos', info);
      setInfos(prev => [...prev, response.data as Info]);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout de l\'information');
      throw err;
    }
  };

  useEffect(() => {
    fetchInfos();
  }, []);

  return (
    <InfoContext.Provider value={{ infos, loading, error, fetchInfos, addInfo }}>
      {children}
    </InfoContext.Provider>
  );
};

export const useInfo = () => {
  const context = useContext(InfoContext);
  if (!context) {
    throw new Error('useInfo doit être utilisé à l\'intérieur d\'un InfoProvider');
  }
  return context;
};