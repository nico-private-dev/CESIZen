import { useState } from 'react';
import { ProfileInfoProps } from '../../types/profile';
import { useAuth } from '../../context/AuthContext';

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  const { updateUsername, changePassword } = useAuth();
  
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
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  
  // Fonction pour gérer la modification du nom d'utilisateur
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);
    setUsernameSuccess(null);
    
    if (newUsername === user.username) {
      setUsernameError("Le nom d'utilisateur est identique à l'actuel");
      return;
    }
    
    if (newUsername.length < 3) {
      setUsernameError("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }
    
    try {
      await updateUsername(newUsername);
      setUsernameSuccess("Nom d'utilisateur mis à jour avec succès");
      setIsEditingUsername(false);
    } catch (error: any) {
      setUsernameError(error.response?.data?.message || "Une erreur est survenue");
    }
  };
  
  // Fonction pour gérer le changement de mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    
    if (newPassword.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess("Mot de passe changé avec succès. Vous allez être déconnecté.");
      
      // Redirection vers la page de connexion après 3 secondes
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || "Une erreur est survenue");
    }
  };
  
  // Fonction pour annuler l'édition du nom d'utilisateur
  const cancelUsernameEdit = () => {
    setIsEditingUsername(false);
    setNewUsername(user.username);
    setUsernameError(null);
    setUsernameSuccess(null);
  };
  
  // Fonction pour annuler le changement de mot de passe
  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    setPasswordSuccess(null);
  };

  return (
    <div className="space-y-8">
      <p className="text-gray-600">Connecté en tant que {user.email}</p>
      
      {/* Informations de base */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <p className="mt-1 text-lg font-semibold">{user.firstname}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <p className="mt-1 text-lg font-semibold">{user.lastname}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-lg font-semibold">{user.email}</p>
        </div>
        
        {/* Section nom d'utilisateur */}
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
            {!isEditingUsername && (
              <button 
                onClick={() => setIsEditingUsername(true)}
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Modifier
              </button>
            )}
          </div>
          
          {isEditingUsername ? (
            <form onSubmit={handleUsernameSubmit} className="mt-2 space-y-3">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
              
              {usernameError && (
                <p className="text-red-600 text-sm">{usernameError}</p>
              )}
              
              {usernameSuccess && (
                <p className="text-green-600 text-sm">{usernameSuccess}</p>
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
            <p className="mt-1 text-lg font-semibold">{user.username}</p>
          )}
        </div>
      </div>
      
      {/* Section changement de mot de passe */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Sécurité</h3>
          {!isChangingPassword && (
            <button 
              onClick={() => setIsChangingPassword(true)}
              className="text-sm bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
            >
              Changer de mot de passe
            </button>
          )}
        </div>
        
        {isChangingPassword && (
          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
            
            {passwordError && (
              <p className="text-red-600 text-sm">{passwordError}</p>
            )}
            
            {passwordSuccess && (
              <p className="text-green-600 text-sm">{passwordSuccess}</p>
            )}
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary-dark transition-colors"
              >
                Changer le mot de passe
              </button>
              <button
                type="button"
                onClick={cancelPasswordChange}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;