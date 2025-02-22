import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { IUser } from '../models/userModel';
import RoleModel from '../models/roleModels';

interface AuthRequest extends Request {
  user?: IUser;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!) as IUser;
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

export const verifyRole = (roleNames: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await UserModel.findById(req.user?._id).populate('role');
    if (!user) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    const role = await RoleModel.findById(user.role);
    if (!role || !roleNames.includes(role.name)) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    next();
  };
};