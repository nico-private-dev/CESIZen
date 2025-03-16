import { Response } from 'express';
import { IAuthRequest } from '../types/auth';
import User from '../models/userModel';

// Récuperer tous les utilisateurs
export const getAllUsers = async (req: IAuthRequest, res: Response) => {
  try {
    // Cherche les users dans la base de données, peuple le rôle et retire le mot de passe
    const users = await User.find()
      .populate('role')
      .select('-password');
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

// Supprimer un utilisateurs
export const deleteUser = async (req: IAuthRequest, res: Response) => {
    try {
      const userIdToDelete = req.params.userId;
      
      // Vérifier si l'utilisateur existe
      const userToDelete = await User.findById(userIdToDelete).populate('role');
      if (!userToDelete) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      // Empêcher la suppression de son propre compte
      if (userToDelete._id.toString() === req.user?._id.toString()) {
        return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
      }
  
      // Empêcher la suppression d'un autre administrateur
      if (typeof userToDelete.role === 'object' && 
          userToDelete.role.name === 'admin' && 
          req.user?._id.toString() !== userToDelete._id.toString()) {
        return res.status(403).json({ message: "Vous ne pouvez pas supprimer un autre administrateur" });
      }
  
      // Supprimer l'utilisateur
      await User.findByIdAndDelete(userIdToDelete);
  
      res.status(200).json({ 
        message: "Utilisateur supprimé avec succès",
        deletedUserId: userIdToDelete 
      });
  
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
  };