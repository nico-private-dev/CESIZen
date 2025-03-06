import { useAuth } from '../../context/AuthContext';
import ProfileInfo from '../../components/Profile/ProfileInfo';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BsPersonCircle, BsShieldLock, BsArrowLeft, BsGear, BsBoxArrowRight } from 'react-icons/bs';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'info' | 'security'>('info');

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8">
        <span className="uppercase text-primary font-semibold">Mon Compte</span>
        <h1 className="text-4xl font-bold mb-4">Gérez votre profil</h1>
      </div>

      {/* Grille Bento pour le profil */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {/* Carte principale avec les informations de profil */}
        <div className="md:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveSection('info')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeSection === 'info' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Informations
              </button>
            </div>
          </div>
          
          {user && <ProfileInfo user={user} activeSection={activeSection} />}
        </div>

        {/* Carte latérale avec les actions rapides */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {/* Carte de bienvenue */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-secondary mb-4">
              <BsPersonCircle className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Bienvenue, {user?.firstname}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {user?.role?.name === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </p>
            <div className="text-sm text-gray-600">
              <p className="truncate">{user?.email}</p>
            </div>
          </div>

          {/* Carte des actions rapides */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setActiveSection('security')}
                className="w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-gray-100"
              >
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <BsBoxArrowRight className="w-5 h-5 text-red-500 mr-3" />
                  <span>Se déconnecter</span>
                </div>
              </button>
            </div>
          </div>

          {/* Carte de navigation */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <div className="space-y-3">
              <Link 
                to="/"
                className="w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <BsArrowLeft className="w-5 h-5 text-secondary mr-3" />
                  <span>Retour à l'accueil</span>
                </div>
              </Link>
              
              {user?.role?.name === 'admin' && (
                <Link 
                  to="/admin"
                  className="w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <BsGear className="w-5 h-5 text-primary mr-3" />
                    <span>Espace admin</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;