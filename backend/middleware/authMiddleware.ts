import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';
import RoleModel from '../models/roleModels';
import { IAuthRequest } from '../types/auth';

// Vérification du token
export const verifyToken = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  
  // Si le token n'est pas présent, vérifier le refresh token
  if (!accessToken) {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Accès non autorisé' });
    }

    try {
      // Vérifier le refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };
      // Récupérer l'utilisateur
      const user = await UserModel.findById(decoded._id);
            
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      // Générer un nouveau access token
      const newAccessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
      
      // Envoyer le nouveau access token
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });

      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Le rafraichissement du token est impossible' });
    }
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as { _id: string };
    const user = await UserModel.findById(decoded._id);
        
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Le token est invalide' });
  }
};

// Vérification du rôle
export const verifyRole = (roleNames: string[]) => {
  return async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      
      if (!req.user) {
        return res.status(403).json({ message: 'Accès non autorisé - utilisateur non défini' });
      }
      
      // Récupérer l'utilisateur avec son rôle populé
      const user = await UserModel.findById(req.user._id).populate('role');
      
      if (!user) {
        return res.status(403).json({ message: 'Accès non autorisé - utilisateur non trouvé' });
      }
      
      // Déterminer le nom du rôle, quelle que soit sa structure
      let roleName = null;
      
      // Si le rôle est un objet avec une propriété name
      if (user.role && typeof user.role === 'object' && 'name' in user.role) {
        roleName = user.role.name;
      }
      // Si le rôle est un ID, le chercher dans la base de données
      else if (user.role) {
        const roleDoc = await RoleModel.findById(user.role);
        if (roleDoc) {
          roleName = roleDoc.name;
        }
      }
      
      // Vérifier si le rôle est autorisé
      if (!roleName || !roleNames.includes(roleName)) {
        return res.status(403).json({ message: 'Accès non autorisé - rôle insuffisant' });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur lors de la vérification du rôle' });
    }
  };
};