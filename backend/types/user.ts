import { Document } from 'mongoose';
import { IRole } from './role';

// Interface pour l'utilisateur
export interface IUser extends Document {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: IRole['_id'];
}