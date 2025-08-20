import RoleModel from '../models/roleModels';

/**
 * Initialise les rôles de base dans la base de données
 */
export const initializeRoles = async (): Promise<void> => {
  try {
    // Vérifier si les rôles existent déjà
    const count = await RoleModel.countDocuments();
    
    if (count === 0) {
      // Créer les rôles de base
      await RoleModel.create([
        { name: 'user' },
        { name: 'admin' }
      ]);
      console.log('✅ Rôles initialisés avec succès');
    } else {
      console.log('ℹ️ Les rôles sont déjà initialisés');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des rôles:', error);
  }
};

export default initializeRoles;
