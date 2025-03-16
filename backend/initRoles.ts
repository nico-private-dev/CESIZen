import dotenv from 'dotenv';
import RoleModel from './models/roleModels';
import connectDB from './config/db';

// Charger les variables d'environnement
dotenv.config();

// Fonction pour initialiser les rôles
const initRoles = async () => {
  await connectDB();

  // Création des rôles
  const roles = [
    { name: 'admin' },
    { name: 'user' },
  ];

  try {
    for (const role of roles) {
      // Création du rôle
      const newRole = new RoleModel(role);
      await newRole.save();
    }
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

initRoles();