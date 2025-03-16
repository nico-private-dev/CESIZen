import { Request } from 'express';
import { IUser } from './user';

// Interface pour la requête d'authentification
export interface IAuthRequest extends Request {
  user?: IUser;
}