import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';
import RoleModel from '../models/roleModels';
import { IAuthRequest } from '../types/auth';

export const verifyToken = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  
  if (!accessToken) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Accès non autorisé' });
    }

    try {
      // Vérifier le refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };
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

export const verifyRole = (roleNames: string[]) => {
  return async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const user = await UserModel.findById(req.user?._id).populate('role');
    if (!user) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const role = await RoleModel.findById(user.role);
    if (!role || !roleNames.includes(role.name)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    next();
  };
};