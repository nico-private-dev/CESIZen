import { Document } from 'mongoose';

// Interface pour les rôles
export interface IRole extends Document {
  name: string;
}