import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { IUser } from '../../types/user';

// Configuration d'axios avec le bon port (5001)
const api = axios.create({
  baseURL: 'http://localhost:5001',
  withCredentials: true
});

function UsersManager() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<IUser[]>('/api/users');
        if (!Array.isArray(response.data)) {
          throw new Error('Format de réponse invalide');
        }
        setUsers(response.data);
      } catch (err) {
        const error = err as AxiosError;
        if (error.response?.status === 401) {
          setError('Vous n\'êtes pas autorisé à accéder à cette ressource');
        } else if (error.response?.status === 404) {
          setError('La ressource demandée n\'existe pas');
        } else if (error.code === 'ECONNREFUSED') {
          setError('Impossible de se connecter au serveur. Vérifiez qu\'il est bien démarré sur le port 5001');
        } else {
          setError('Une erreur est survenue lors du chargement des utilisateurs');
        }
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Gestion des Utilisateurs
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom d'utilisateur</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {typeof user.role === 'object' ? user.role.name : (user.isAdmin ? 'Administrateur' : 'Utilisateur')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default UsersManager;