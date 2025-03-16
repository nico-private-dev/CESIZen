import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';
import RoleModel from '../models/roleModels';
import { IAuthRequest } from '../types/auth';

export const verifyToken = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  
  console.log('=== DEBUG VERIFY TOKEN ===');
  console.log('Cookies:', req.cookies);
  console.log('Access Token:', accessToken ? 'Présent' : 'Absent');
  
  if (!accessToken) {
    const refreshToken = req.cookies.refreshToken;
    console.log('Refresh Token:', refreshToken ? 'Présent' : 'Absent');
    
    if (!refreshToken) {
      console.log('Aucun token trouvé');
      return res.status(401).json({ message: 'Accès non autorisé' });
    }

    try {
      // Vérifier le refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };
      const user = await UserModel.findById(decoded._id);
      
      console.log('User from refresh token:', user ? 'Trouvé' : 'Non trouvé');
      
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
    
    console.log('User from access token:', user ? 'Trouvé' : 'Non trouvé');
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Le token est invalide' });
  }
};

export const verifyRole = (roleNames: string[]) => {
  return async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log('=== DEBUG VERIFY ROLE ===');
      console.log('Rôles autorisés:', roleNames);
      console.log('User:', JSON.stringify(req.user));
      
      if (!req.user) {
        console.log('Utilisateur non défini dans la requête');
        return res.status(403).json({ message: 'Accès non autorisé - utilisateur non défini' });
      }
      
      // Récupérer l'utilisateur avec son rôle populé
      const user = await UserModel.findById(req.user._id).populate('role');
      console.log('User trouvé avec populate:', user ? 'Oui' : 'Non');
      
      if (!user) {
        console.log('Utilisateur non trouvé dans la base de données');
        return res.status(403).json({ message: 'Accès non autorisé - utilisateur non trouvé' });
      }
      
      console.log('Rôle brut:', user.role);
      
      // Déterminer le nom du rôle, quelle que soit sa structure
      let roleName = null;
      
      // Si le rôle est un objet avec une propriété name
      if (user.role && typeof user.role === 'object' && 'name' in user.role) {
        roleName = user.role.name;
        console.log('Rôle trouvé (objet):', roleName);
      }
      // Si le rôle est un ID, le chercher dans la base de données
      else if (user.role) {
        const roleDoc = await RoleModel.findById(user.role);
        if (roleDoc) {
          roleName = roleDoc.name;
          console.log('Rôle trouvé (ID):', roleName);
        }
      }
      
      console.log('Nom du rôle final:', roleName);
      console.log('Est-ce un rôle autorisé:', roleName && roleNames.includes(roleName) ? 'Oui' : 'Non');
      
      // Vérifier si le rôle est autorisé
      if (!roleName || !roleNames.includes(roleName)) {
        console.log('Rôle non autorisé');
        return res.status(403).json({ message: 'Accès non autorisé - rôle insuffisant' });
      }
      
      console.log('Vérification du rôle réussie');
      next();
    } catch (error) {
      console.error('Erreur de vérification de rôle:', error);
      return res.status(500).json({ message: 'Erreur serveur lors de la vérification du rôle' });
    }
  };
};