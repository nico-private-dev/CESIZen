import { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get<IUser[]>('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      setError('Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await api.delete(`/api/users/${userId}`);
      // Rafraîchir la liste des utilisateurs
      fetchUsers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur';
      alert(errorMessage);
    }
  };

  // Calcul de la pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 p-4 text-red-700 bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="overflow-x-auto rounded-t-lg">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Nom d'utilisateur</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Nom</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Prénom</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Email</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Rôle</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 text-center font-medium whitespace-nowrap text-gray-900">{user.username}</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{user.lastname}</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{user.firstname}</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{user.email}</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">
                    {typeof user.role === 'object' ? user.role.name : (user.isAdmin ? 'Administrateur' : 'Utilisateur')}
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
          <ol className="flex justify-end gap-1 text-xs font-medium">
            <li>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex size-8 items-center justify-center rounded-sm border border-gray-100 bg-white text-gray-900 disabled:opacity-50"
              >
                <span className="sr-only">Page précédente</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>

            {[...Array(totalPages)].map((_, index) => (
              <li key={index + 1}>
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className={`block size-8 rounded-sm text-center leading-8 ${
                    currentPage === index + 1
                      ? 'border-secondary bg-secondary text-black'
                      : 'border border-gray-100 bg-white text-gray-900'
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex size-8 items-center justify-center rounded-sm border border-gray-100 bg-white text-gray-900 disabled:opacity-50"
              >
                <span className="sr-only">Page suivante</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default UsersManager;