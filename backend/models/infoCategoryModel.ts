import mongoose, { Schema } from 'mongoose';
import { IInfoCategory } from '../types/infos';

//Création du Schéma pour les categories d'informations
const infoCategorySchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String 
  }
});

export default mongoose.model<IInfoCategory>('InfoCategory', infoCategorySchema);