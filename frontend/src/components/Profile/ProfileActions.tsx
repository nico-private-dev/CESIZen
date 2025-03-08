import useAuthStore from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BsBoxArrowRight } from 'react-icons/bs';

const ProfileActions = () => {
  const { logout } = useAuthStore();
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
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Actions</h3>
      <button 
        onClick={handleLogout}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 bg-primary text-white p-3 rounded-lg font-medium transition duration-300 ease
          ${isLoading 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-primary-dark'
          }`}
      >
        <BsBoxArrowRight className="w-5 h-5" />
        {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
      </button>
    </div>
  );
};

export default ProfileActions;