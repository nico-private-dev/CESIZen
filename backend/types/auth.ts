import { Request } from 'express';
import { IUser } from './user';

export interface IAuthRequest extends Request {
  user?: IUser;
}