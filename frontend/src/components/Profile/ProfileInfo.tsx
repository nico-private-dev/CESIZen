import { useState } from 'react';
import { ProfileInfoProps } from '../../types/profile';
import useAuthStore from '../../stores/useAuthStore';
import { BsCheckCircle, BsXCircle, BsPencil } from 'react-icons/bs';

// Composant de profil avec gestion des modifications
const ProfileInfo = ({ user, activeSection = 'info' }: ProfileInfoProps) => {
  const { updateUsername } = useAuthStore();
  
  // États pour la modification du nom d'utilisateur
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);
  
  // États pour le changement de mot de passe
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Fonction pour gérer la modification du nom d'utilisateur
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);
    setUsernameSuccess(null);
    
    if (newUsername === user.username) {
      setUsernameError("Le nom d'utilisateur est identique à l'actuel");
      return;
    }
    
    // Vérifier si le nom d'utilisateur est pas trop court
    if (newUsername.length < 3) {
      setUsernameError("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }
    
    // Tentative de mise à jour du nom d'utilisateur
    try {
      await updateUsername(newUsername);
      setUsernameSuccess("Nom d'utilisateur mis à jour avec succès");
      setIsEditingUsername(false);
    } catch (error: any) {
      setUsernameError(error.response?.data?.message || "Une erreur est survenue");
    }
  };
  
  // Fonction pour annuler l'édition du nom d'utilisateur
  const cancelUsernameEdit = () => {
    setIsEditingUsername(false);
    setNewUsername(user.username);
    setUsernameError(null);
    setUsernameSuccess(null);
  };

  return (
    <div>
      {activeSection === 'info' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Carte d'informations personnelles */}
            <div className="bg-gray-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <p className="mt-1 text-lg font-semibold">{user.firstname}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <p className="mt-1 text-lg font-semibold">{user.lastname}</p>
                </div>
              </div>
            </div>

            {/* Carte d'informations de contact */}
            <div className="bg-gray-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Informations de contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-lg font-semibold">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Carte du nom d'utilisateur */}
          <div className="bg-gray-50 p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nom d'utilisateur</h3>
              {!isEditingUsername && (
                <button 
                  onClick={() => setIsEditingUsername(true)}
                  className="text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                >
                  <BsPencil className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
              )}
            </div>
            
            {isEditingUsername ? (
              <form onSubmit={handleUsernameSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>
                
                {usernameError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <BsXCircle className="w-4 h-4" />
                    <span>{usernameError}</span>
                  </div>
                )}
                
                {usernameSuccess && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <BsCheckCircle className="w-4 h-4" />
                    <span>{usernameSuccess}</span>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary-dark transition-colors"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={cancelUsernameEdit}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-lg">{user.username}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;