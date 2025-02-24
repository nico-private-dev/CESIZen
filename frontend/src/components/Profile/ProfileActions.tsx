import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileActions: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="mt-8 space-y-4">
      <button 
        onClick={handleLogout}
        className="w-full bg-primary text-white p-2 rounded border-2 border-primary font-bold hover:bg-transparent hover:text-primary transition duration-300 ease"
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default ProfileActions;