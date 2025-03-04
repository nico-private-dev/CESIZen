import mongoose, { Schema } from 'mongoose';
import { IInfo } from '../types/infos';

//Création du Schéma pour les informations Cesizen
const infoSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'InfoCategory', 
    required: true 
  }
}, {
  // génère automatiquement createdAt et updatedAt
  timestamps: true
});

export default mongoose.model<IInfo>('Info', infoSchema);