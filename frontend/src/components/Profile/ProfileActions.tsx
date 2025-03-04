import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User } from '../../types';

interface ProfileActionsProps {
  user: User;
}

const ProfileActions = ({ user }: ProfileActionsProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <p className="text-gray-600">Connecté en tant que {user.email}</p>
      <button 
        onClick={handleLogout}
        disabled={isLoading}
        className={`w-full bg-primary text-white p-2 rounded border-2 border-primary font-bold transition duration-300 ease
          ${isLoading 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-transparent hover:text-primary'
          }`}
      >
        {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
      </button>
    </div>
  );
};

export default ProfileActions;