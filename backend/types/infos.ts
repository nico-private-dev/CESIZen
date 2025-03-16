import { Document } from 'mongoose';

// Interface pour l'info
export interface IInfo extends Document {
  title: string;
  content: string;
  category: IInfoCategory['_id'];
}

// Interface pour les cartégories d'informations
export interface IInfoCategory extends Document {
  name: string;
  description?: string;
}