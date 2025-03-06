import { Request, Response } from 'express';
import User from '../models/userModel';

export const getAllUsers = async (req: Request, res: Response) => {
  try {

    // Cherche les users dans la base de données et retire le mot de passe
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};