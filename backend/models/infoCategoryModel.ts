import mongoose, { Schema } from 'mongoose';
import { IInfoCategory } from '../types/infos';

//Création du Schéma pour les categories d'informations Cesizen
const infoCategorySchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String 
  }
}, {
  // génère automatiquement createdAt et updatedAt
  timestamps: true
});

export default mongoose.model<IInfoCategory>('InfoCategory', infoCategorySchema);